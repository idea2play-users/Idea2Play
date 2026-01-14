import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Idea2Play's AI Game Design Assistant.
Collect required fields and respond ONLY in JSON.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { messages, generateImage } = req.body;

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    });

    const aiResponse = JSON.parse(chat.choices[0].message.content);

    let imageUrl = null;
    if (aiResponse.readyToSubmit && generateImage) {
      const image = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `${aiResponse.gameData.title} board game`,
        size: "1024x1024",
      });
      imageUrl = image.data[0].url;
    }

    res.json({ ...aiResponse, imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
}
