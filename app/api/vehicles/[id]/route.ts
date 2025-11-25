import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const id = pathname.split("/").pop();
  try {
    const vehicle = await client.fetch(
      `*[_type == "event" && _id == $id && disabled != true][0]`,
      {
        id,
      }
    );

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const id = pathname.split("/").pop();
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
  }
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.brand || !body.name) {
      return NextResponse.json(
        { error: "Brand and name are required" },
        { status: 400 }
      );
    }

    const result = await client
      .patch(id)
      .set({
        brand: body.brand,
        name: body.name,
        type: body.type || "",
        description: body.description || "",
        exteriorImages: body.exteriorImages || [],
        interiorImages: body.interiorImages || [],
        specifications: body.specifications || {
          keyParameters: [],
          bodyParameters: [],
          engineParameters: [],
          motorParameters: [],
          wheelBrakeParameters: [],
          keyConfigurations: [],
        },
      })
      .commit();

    return NextResponse.json({
      success: true,
      data: result,
      message: "Vehicle updated successfully",
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      {
        error: "Failed to update vehicle",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const id = pathname.split("/").pop();
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
  }
  try {
    await client.delete(id);

    return NextResponse.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
