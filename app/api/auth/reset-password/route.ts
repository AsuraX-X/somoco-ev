import { NextRequest, NextResponse } from "next/server";
import { sendResendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { client } from "@/sanity/lib/client";

function generatePassword(len = 16) {
  return randomBytes(Math.ceil((len * 3) / 4))
    .toString("base64url")
    .slice(0, len);
}

// No local .env writes: we persist admin password hash only to Sanity.

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    // Verify this is the admin username
    if (username !== process.env.ADMIN_USERNAME) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json(
        {
          error:
            "Admin email not configured. Please set ADMIN_EMAIL in .env.local",
        },
        { status: 500 }
      );
    }

    // Verify Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Resend API key not configured. Please set RESEND_API_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    // Generate new password
    const newPassword = generatePassword(16);
    const hash = await bcrypt.hash(newPassword, 10);
    const hashB64 = Buffer.from(hash, "utf8").toString("base64");

    // Require SANITY_API_TOKEN so the new hash can be persisted. We no longer
    // support writing to a local .env file; the admin password hash must be
    // stored in Sanity. If the token is missing, fail fast to avoid emailing
    // a password that can't be persisted.
    const canWriteToSanity = !!process.env.SANITY_API_TOKEN;
    if (!canWriteToSanity) {
      console.error(
        "Cannot reset admin password: SANITY_API_TOKEN is not configured."
      );
      return NextResponse.json(
        {
          error:
            "Cannot reset admin password because SANITY_API_TOKEN is not configured. Configure a write token and retry, or rotate the password via your deployment provider.",
        },
        { status: 500 }
      );
    }

    // Store the hash in Sanity using a fixed document id. If this fails we
    // return an error — we do not write local .env files anymore.
    try {
      await client.createOrReplace({
        _id: "adminCredentials",
        _type: "adminCredentials",
        passwordHash: hash,
        passwordHashB64: hashB64,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to save admin credentials to Sanity:", err);
      return NextResponse.json(
        {
          error:
            "Failed to save admin credentials to Sanity. Ensure SANITY_API_TOKEN has write permissions and the dataset exists.",
        },
        { status: 500 }
      );
    }

    // Send email with new password using Resend
    try {
      await sendResendPasswordResetEmail({
        to: adminEmail,
        newPassword,
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "A new password has been generated and sent to the admin email. The password hash was saved to Sanity (document id: 'adminCredentials').",
    });
  } catch (error) {
    console.error("Password reset error:", error);

    // Provide more detailed error information
    let errorMessage = "Failed to reset password. ";
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      errorMessage += error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
