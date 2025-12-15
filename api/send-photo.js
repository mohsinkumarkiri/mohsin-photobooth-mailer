import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { mailTo, imageData } = req.body;

  if (!mailTo || !imageData) {
    return res.status(400).json({ error: "Missing mailTo or imageData" });
  }

  try {
    const msg = {
      to: mailTo,
      from: "noreply@yourdomain.com", // must be verified in SendGrid
      subject: "Your Photo Booth Image",
      html: "<p>Thank you for using the photo booth.</p>",
      attachments: [
        {
          content: imageData,
          filename: "photo.jpg",
          type: "image/jpeg",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Email sending failed" });
  }
}
