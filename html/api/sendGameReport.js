import nodemailer from "nodemailer";

export default async function handler(req, res) {
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

   const html = `
  <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;">
    <h2>🎮 New Game Idea Submitted</h2>

    <p><strong>User:</strong> ${userEmail}</p>

    <h3>${gameData.title}</h3>

    <ul>
      <li><strong>Game Type:</strong> ${gameData.gameType}</li>
      <li><strong>Players:</strong> ${gameData.players}</li>
      <li><strong>Age Range:</strong> ${gameData.ageRange}</li>
      <li><strong>Duration:</strong> ${gameData.duration}</li>
    </ul>

    <h4>Description</h4>
    <p>${gameData.description}</p>

    <h4>Rules</h4>
    <p>${gameData.rules}</p>

    ${
      imageUrl
        ? `
          <h4>Concept Image</h4>
          <img 
            src="${imageUrl}" 
            alt="Game concept"
            style="width:100%;max-width:600px;border-radius:12px;border:1px solid #eee;"
          />
        `
        : "<p><em>No image generated</em></p>"
    }

    <hr />
    <p style="color:#666;font-size:12px;">
      Idea2Play – AI Game Design Assistant
    </p>
  </div>
`;


    await transporter.sendMail({
      from: `"Idea2Play" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Game Idea: ${gameData.title}`,
      html,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send report" });
  }
}
