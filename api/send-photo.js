// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Only POST allowed" });
//   }

//   const { mailTo, imageData, videoUrl } = req.body;

//   // ✅ Correct validation
//   if (!mailTo || (!imageData && !videoUrl)) {
//     return res.status(400).json({
//       error: "mailTo and either imageData or videoUrl are required",
//     });
//   }

//   // Build email HTML
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
//       attachments: imageData
//         ? [
//             {
//               filename: "photo.jpg",
//               content: imageData,
//               type: "image/jpeg",
//             },
//           ]
//         : [], // ✅ No attachment for video-only
//     });

//     console.log("✅ Email sent to:", mailTo);

//     return res.status(200).json({
//       success: true,
//       videoIncluded: !!videoUrl,
//       imageIncluded: !!imageData,
//     });
//   } catch (error) {
//     console.error("❌ Email error:", error);
//     return res.status(500).json({ error: "Email sending failed" });
//   }
// }

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// HTML template with placeholders
const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lazulite Photo Booth</title>
  <style>
    body {margin:0; padding:0; font-family: Arial, sans-serif; background:#f9f9f9; color:#333;}
    a {color:#4CAF50; text-decoration:none;}
    .container {width:100%; max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);}
    .header {background:#4CAF50; color:white; text-align:center; padding:30px 20px;}
    .header h1 {margin:0; font-size:28px;}
    .content {padding:20px;}
    .content p {font-size:16px; line-height:1.5;}
    .image-container {text-align:center; margin:20px 0;}
    .image-container img {max-width:100%; border-radius:10px;}
    .button {display:inline-block; padding:12px 25px; background:#4CAF50; color:white; border-radius:6px; font-weight:bold; margin-top:15px;}
    .footer {text-align:center; font-size:12px; color:#777; padding:15px 20px;}
    @media only screen and (max-width: 600px){.header h1{font-size:24px;}.content p{font-size:14px;}}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Lazulite Photo Booth</h1>
    </div>
    <div class="content">
      <p>Hi there!</p>
      <p>Thank you for using the Lazulite Photo Booth. Your memories are ready to enjoy!</p>
      {{IMAGE_SECTION}}
      {{VIDEO_SECTION}}
      <p>Connect with us: <a href="https://www.lazulite.ae">www.lazulite.ae</a></p>
    </div>
    <div class="footer">
      © 2025 Lazulite. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { mailTo, imageData, videoUrl } = req.body;

  // Validate
  if (!mailTo || (!imageData && !videoUrl)) {
    return res.status(400).json({
      error: "mailTo and either imageData or videoUrl are required",
    });
  }

  // Prepare email HTML
  let htmlContent = emailTemplate;

  // Insert image if available
  if (imageData) {
    htmlContent = htmlContent.replace(
      "{{IMAGE_SECTION}}",
      `<div class="image-container">
         <img src="data:image/jpeg;base64,${imageData}" alt="Your Photo" />
       </div>`
    );
  } else {
    htmlContent = htmlContent.replace("{{IMAGE_SECTION}}", "");
  }

  // Insert video button if available
  if (videoUrl) {
    htmlContent = htmlContent.replace(
      "{{VIDEO_SECTION}}",
      `<p>
         🎥 <strong>Your video:</strong><br/>
         <a href="${videoUrl}" class="button" target="_blank">Download Your Video</a>
       </p>`
    );
  } else {
    htmlContent = htmlContent.replace("{{VIDEO_SECTION}}", "");
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
        : [],
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
