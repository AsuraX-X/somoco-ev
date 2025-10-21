import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { sendPasswordResetEmail } from "@/lib/email";

function generatePassword(len = 16) {
  return randomBytes(Math.ceil((len * 3) / 4))
    .toString("base64url")
    .slice(0, len);
}

function updateEnvFile(key: string, value: string) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  let envContent = fs.readFileSync(envPath, "utf8");

  const re = new RegExp(`^${key}=.*$`, "m");
  const line = `${key}=${value}`;

  if (re.test(envContent)) {
    envContent = envContent.replace(re, line);
  } else {
    envContent = envContent.trimEnd() + `\n${line}\n`;
  }

  fs.writeFileSync(envPath, envContent, "utf8");
}

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

    // Verify SMTP is configured
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      return NextResponse.json(
        {
          error:
            "Email service not configured. Please set SMTP credentials in .env.local",
        },
        { status: 500 }
      );
    }

    // Generate new password
    const newPassword = generatePassword(16);
    const hash = await bcrypt.hash(newPassword, 10);
    const hashB64 = Buffer.from(hash, "utf8").toString("base64");

    // Update .env.local file
    updateEnvFile("ADMIN_PASSWORD_HASH_B64", hashB64);
    updateEnvFile("ADMIN_PASSWORD_HASH", `'${hash}'`);

    // Send email with new password
    await sendPasswordResetEmail(adminEmail, newPassword);

    return NextResponse.json({
      success: true,
      message:
        "A new password has been generated and sent to your email. Please restart the server for the changes to take effect.",
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
