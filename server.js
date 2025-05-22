const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const TELEGRAM_BOT_TOKEN = "7674928346:AAEd6FNCSB_ozfmqs7islmmEaH6x8bWivVQ";
const TELEGRAM_CHAT_ID = "1276935257";

app.post("/send-message", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "Texto é obrigatório" });

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.get(url, {
      params: {
        chat_id: TELEGRAM_CHAT_ID,
        text,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Erro ao enviar mensagem" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

