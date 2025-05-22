const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { enviarDados } = require("./enviarDados");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // aumentar limite para base64

// Endpoint para receber dados do frontend
app.post("/send-data", async (req, res) => {
  const { latitude, longitude, maps, photo } = req.body;

  if (!latitude || !longitude || !maps) {
    return res.status(400).json({ success: false, message: "Dados insuficientes" });
  }

  try {
    await enviarDados(latitude, longitude, maps, photo, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno no servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

