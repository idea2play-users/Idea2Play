import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { gameData, imageUrl, userEmail } = req.body;
    if (!gameData || !userEmail) {
      return res.status(400).json({ error: "Missing data" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Idea2Play" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Game Idea: ${gameData.title}`,
      html: `<pre>${JSON.stringify(gameData, null, 2)}</pre>
             ${imageUrl ? `<img src="${imageUrl}" />` : ""}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send report" });
  }
}
