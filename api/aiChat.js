import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { messages, generateImage } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages" });
    }

    // 🧠 Chat completion
    const chat = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  response_format: { type: "json_object" },
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages
  ]
});
            const SYSTEM_PROMPT = `You are Idea2Play's AI Game Design Assistant.

Your goal is to help the user fully define a game concept.

You must extract and track the following required fields:
- title
- gameType
- players
- ageRange
- duration
- description
- rules

Rules:
1. Never invent missing information.
2. If any required field is missing, ask a clear and specific question for it.
3. Ask ONLY about missing fields.
4. Be friendly, concise, and professional.
5. When all fields are collected, ask:
   "Are you ready to submit your game idea?"

When all data is complete, respond with:
- A short summary
- A confirmation question

Return your response in JSON format:
{
  "reply": string,
  "missingFields": string[],
  "readyToSubmit": boolean,
  "gameData": object
}
`;,
        

    const aiResponse = JSON.parse(chat.choices[0].message.content);

let imageUrl = null;

if (aiResponse.readyToSubmit && generateImage) {
  const image = await openai.images.generate({
    model: "gpt-image-1",
    prompt: `${aiResponse.gameData.title} board game, high quality product photo`,
    size: "1024x1024"
  });
  imageUrl = image.data[0].url;
}

res.json({
  reply: aiResponse.reply,
  missingFields: aiResponse.missingFields,
  readyToSubmit: aiResponse.readyToSubmit,
  gameData: aiResponse.gameData,
  imageUrl
});

      } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
}
