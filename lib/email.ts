import { Resend } from "resend";

export async function sendResendPasswordResetEmail({
  to,
  newPassword,
  from = "Somoco EV RP <onboarding@resend.dev>",
}: {
  to: string;
  newPassword: string;
  from?: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  try {
    await resend.emails.send({
      from,
      to,
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
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
