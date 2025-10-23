import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function makeTransport(port: number) {
  const secure = port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      servername: process.env.SMTP_HOST,
    },
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 30_000,
  });
}

async function getVerifiedTransport(preferredPort: number) {
  const tried: { port: number; error?: string }[] = [];
  const order: number[] = [preferredPort, preferredPort === 587 ? 465 : 587];

  for (const port of order) {
    const transporter = makeTransport(port);
    try {
      await transporter.verify();
      return transporter;
    } catch (e) {
      const err = e as Error;
      tried.push({ port, error: err.message });
    }
  }

  const details = tried
    .map((t) => `port ${t.port}: ${t.error || "unknown error"}`)
    .join(" | ");
  throw new Error(`SMTP verify failed on all ports (${details})`);
}

export async function POST(request: Request) {
  try {
    const { name, phone, email, message } = await request.json();

    // Validate required fields
    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const preferredPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const transporter = await getVerifiedTransport(preferredPort);

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "cs@somotex.com",
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #00c950; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: #ffffff; margin: 0;">New Contact Form Submission</h2>
          </div>
          <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #1a1a1a; margin-top: 0;">Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold; width: 100px;">Name:</td>
                  <td style="padding: 10px 0; color: #1a1a1a;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">Phone:</td>
                  <td style="padding: 10px 0; color: #1a1a1a;">
                    <a href="tel:${phone}" style="color: #00c950; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; color: #1a1a1a;">
                    <a href="mailto:${email}" style="color: #00c950; text-decoration: none;">${email}</a>
                  </td>
                </tr>
              </table>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1a1a1a; margin-top: 0;">Message</h3>
              <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>This email was sent from the SOMOCO EV contact form</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
