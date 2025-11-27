import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,   // 🔥 이제 정상 작동
});

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await client.responses.create({
      model: "gpt-5.1",
      input: prompt,
    });

    res.json({ answer: response.output_text });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI API 오류" });
  }
});

app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});
