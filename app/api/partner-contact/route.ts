import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, city, region, partnerName, partnerEmail } =
      await request.json();

    if (!partnerEmail) {
      return NextResponse.json(
        { success: false, error: "Partner email not configured" },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: "Somoco EV <onboarding@resend.dev>",
      // to: partnerEmail,
      to: "kiba741@gmail.com",
      replyTo: email,
      subject: `New Finance Inquiry from ${name} via Somoco EV`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00c950;">New Asset Finance Inquiry</h2>
          <p style="color: #666;">This inquiry was submitted through the Somoco EV website.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            ${city ? `<p><strong>City:</strong> ${city}</p>` : ""}
            ${region ? `<p><strong>Region:</strong> ${region}</p>` : ""}
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Please reach out to this customer at your earliest convenience.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            This email was sent via Somoco EV's asset finance partner program.
          </p>
        </div>
      `,
    });

    // Also send a copy to Somoco for tracking
    await resend.emails.send({
      from: "Somoco EV <onboarding@resend.dev>",
      to: "kiba741@gmail.com",
      subject: `[Copy] Finance Inquiry to ${partnerName} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00c950;">Finance Inquiry Copy</h2>
          <p style="color: #666;">A customer has submitted an inquiry to <strong>${partnerName}</strong>.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            ${city ? `<p><strong>City:</strong> ${city}</p>` : ""}
            ${region ? `<p><strong>Region:</strong> ${region}</p>` : ""}
          </div>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px;">
            <p style="margin: 0;"><strong>Partner:</strong> ${partnerName}</p>
            <p style="margin: 5px 0 0 0;"><strong>Partner Email:</strong> ${partnerEmail}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
