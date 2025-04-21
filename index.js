const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const prompt = req.body.queryResult.queryText;

  try {
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "Sen bir e-ticaret müşteri temsilcisisin. Kısa, net, ilgili ve Türkçe cevaplar ver." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = gptResponse.data.choices[0].message.content;
    return res.json({
      fulfillmentText: reply,
    });
  } catch (error) {
    console.error("GPT-4 API error:", error.response?.data || error.message);
    return res.json({
      fulfillmentText: "Üzgünüm, şu anda size yardımcı olamıyorum.",
    });
  }
});

app.get("/", (req, res) => {
  res.send("GPT4 Dialogflow Bot Çalışıyor");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});