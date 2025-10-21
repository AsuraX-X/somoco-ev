import nodemailer from "nodemailer";

function makeTransport(port: number) {
  const secure = port === 465; // 465 = SMTPS
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure, // use STARTTLS on 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // Helps SNI with some providers
      servername: process.env.SMTP_HOST,
    },
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 30_000,
    // Enable debug logs only in dev to diagnose connection issues
    logger: process.env.NODE_ENV !== "production",
    debug: process.env.NODE_ENV !== "production",
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

export async function sendPasswordResetEmail(
  email: string,
  newPassword: string
) {
  const preferredPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const transporter = await getVerifiedTransport(preferredPort);

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Admin Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Password Reset Successful</h2>
        <p>Your admin password has been reset. Here are your new credentials:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Username:</strong> admin</p>
          <p style="margin: 5px 0;"><strong>New Password:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 3px;">${newPassword}</code></p>
        </div>
        <p style="color: #666; font-size: 14px;">
          Please log in with this password and consider changing it to something memorable.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't request this password reset, please contact your system administrator immediately.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (e) {
    const err = e as Error;
    throw new Error(`SMTP send failed: ${err.message}`);
  }
}
