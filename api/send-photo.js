import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { mailTo, imageData } = req.body;

  if (!mailTo || !imageData) {
    return res.status(400).json({
      error: "mailTo and imageData are required",
    });
  }

  try {
    await resend.emails.send({
      from: "Photo Booth <onboarding@resend.dev>",
      to: mailTo,
      subject: "Your Photo Booth Picture",
      html: "<p>Thank you for using the photo booth!</p>",
      attachments: [
        {
          filename: "photo.jpg",
          content: imageData, // Base64 string
          type: "image/jpeg",
        },
      ],
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Email sending failed" });
  }
}
