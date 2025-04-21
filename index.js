const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  console.log("➡️ Webhook çağrıldı");

  const prompt = req.body.queryResult?.queryText || "Merhaba";
  console.log("🎯 Kullanıcı mesajı:", prompt);

  try {
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Sen bir e-ticaret müşteri temsilcisisin. Türkçe, kısa ve ilgili cevaplar ver.",
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = gptResponse.data.choices[0].message.content;
    console.log("✅ GPT yanıtı:", reply);

    return res.json({
      fulfillmentText: reply,
    });
  } catch (error) {
    console.error("❌ GPT-4 API Hatası:", error.response?.data || error.message);
    return res.json({
      fulfillmentText: "Üzgünüm, şu anda size yardımcı olamıyorum.",
    });
  }
});

app.get("/", (req, res) => {
  res.send("✅ GPT-4 Webhook çalışıyor");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});
