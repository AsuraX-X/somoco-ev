import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.brand || !body.name) {
      return NextResponse.json(
        { error: "Brand and name are required" },
        { status: 400 }
      );
    }

    // Create the document in Sanity
    const document = {
      _type: "event", // Your vehicle type name
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
    };

    const result = await client.create(document);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Vehicle created successfully",
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      {
        error: "Failed to create vehicle",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const vehicles = await client.fetch(
      `*[_type == "event" && disabled != true] | order(_createdAt desc)`
    );

    return NextResponse.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}
