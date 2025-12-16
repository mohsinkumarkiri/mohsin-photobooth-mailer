// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Only POST allowed" });
//   }

//   const { mailTo, imageData } = req.body;

//   if (!mailTo || !imageData) {
//     return res.status(400).json({
//       error: "mailTo and imageData are required",
//     });
//   }

//   try {
//     await resend.emails.send({
//       from: "Lazulite - Photo Booth <onboarding@resend.dev>",
//       to: mailTo,
//       subject: "Lazulite - Your Photo Booth Picture",
//       html: "<p>Thank you for using the photo booth! Connect Lazulite at <a> www.lazulite.ae </a> </p>",
//       attachments: [
//         {
//           filename: "photo.jpg",
//           content: imageData, // Base64 string
//           type: "image/jpeg",
//         },
//       ],
//     });

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Email error:", error);
//     return res.status(500).json({ error: "Email sending failed" });
//   }
// }


// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Only POST allowed" });
//   }

//   const { mailTo, imageData, videoUrl } = req.body;

//   if (!mailTo || !imageData) {
//     return res.status(400).json({
//       error: "mailTo and imageData are required",
//     });
//   }

//   // Build email HTML dynamically
//   let htmlContent = `
//     <p>Thank you for using the Lazulite Photo Booth!</p>
//     <p>
//       🌐 Connect with Lazulite:
//       <a href="https://www.lazulite.ae">www.lazulite.ae</a>
//     </p>
//   `;

//   if (videoUrl) {
//     htmlContent += `
//       <p>
//         🎥 <strong>Your video is ready:</strong><br/>
//         <a href="${videoUrl}" target="_blank">Click here to download your video</a>
//       </p>
//     `;
//   }

//   try {
//     await resend.emails.send({
//       from: "Lazulite - Photo Booth <onboarding@resend.dev>",
//       to: mailTo,
//       subject: "Lazulite - Your Photo Booth Memories",
//       html: htmlContent,
//       attachments: [
//         {
//           filename: "photo.jpg",
//           content: imageData,
//           type: "image/jpeg",
//         },
//       ],
//     });

//     console.log("✅ Email sent to:", mailTo);

//     return res.status(200).json({
//       success: true,
//       videoIncluded: !!videoUrl,
//     });
//   } catch (error) {
//     console.error("❌ Email error:", error);
//     return res.status(500).json({ error: "Email sending failed" });
//   }
// }


import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { mailTo, imageData, videoUrl } = req.body;

  // ✅ Correct validation
  if (!mailTo || (!imageData && !videoUrl)) {
    return res.status(400).json({
      error: "mailTo and either imageData or videoUrl are required",
    });
  }

  // Build email HTML
  let htmlContent = `
    <p>Thank you for using the Lazulite Photo Booth!</p>
    <p>
      🌐 Connect with Lazulite:
      <a href="https://www.lazulite.ae">www.lazulite.ae</a>
    </p>
  `;

  if (videoUrl) {
    htmlContent += `
      <p>
        🎥 <strong>Your video is ready:</strong><br/>
        <a href="${videoUrl}" target="_blank">Click here to download your video</a>
      </p>
    `;
  }

  try {
    await resend.emails.send({
      from: "Lazulite - Photo Booth <onboarding@resend.dev>",
      to: mailTo,
      subject: "Lazulite - Your Photo Booth Memories",
      html: htmlContent,
      attachments: imageData
        ? [
            {
              filename: "photo.jpg",
              content: imageData,
              type: "image/jpeg",
            },
          ]
        : [], // ✅ No attachment for video-only
    });

    console.log("✅ Email sent to:", mailTo);

    return res.status(200).json({
      success: true,
      videoIncluded: !!videoUrl,
      imageIncluded: !!imageData,
    });
  } catch (error) {
    console.error("❌ Email error:", error);
    return res.status(500).json({ error: "Email sending failed" });
  }
}

