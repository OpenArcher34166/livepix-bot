const express = require("express");
const filaController = require("./src/controllers/filaController");

const app = express();

// =========================
// 🔧 MIDDLEWARES (IMPORTANTE NO RENDER)
// =========================
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// =========================
// 🔥 LOG DE START
// =========================
console.log("🔥 SERVER INICIADO");

// =========================
// 🌐 ROTA DE TESTE
// =========================
app.get("/", (req, res) => {
  res.send("LivePix Bot Online");
});

// =========================
// 💰 WEBHOOK LIVEPIX
// =========================
app.post("/webhook/livepix", async (req, res) => {
  console.log("🔥 CHEGOU NO WEBHOOK");
  console.log("BODY:", req.body);

  try {
    const { nome_pix, id_freefire, valor } = req.body || {};

    if (!nome_pix || !id_freefire || !valor) {
      console.log("❌ DADOS INVÁLIDOS");
      return res.status(400).send("dados inválidos");
    }

    const valorNum = Number(valor);

    if (isNaN(valorNum)) {
      console.log("❌ VALOR INVÁLIDO");
      return res.status(400).send("valor inválido");
    }

    // 🔥 CHAMADA CORRETA DO CONTROLLER
    await filaController.adicionar(
      nome_pix,
      id_freefire,
      valorNum,
      0
    );

    console.log("✅ PROCESSADO COM SUCESSO");
    return res.status(200).send("OK");

  } catch (err) {
  console.log("🔥🔥🔥 ERRO REAL COMPLETO 🔥🔥🔥");
  console.log(err);
  console.log(err?.stack);

  return res.status(500).send({
    message: err?.message,
    full: err
  });
}
});

// =========================
// 🚀 PORTA RENDER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 Express rodando na porta", PORT);
});

// =========================
// 🤖 DISCORD BOT
// =========================
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

require("./src/events/messageCreate")(client);
require("./src/events/ready")(client);

client.login(process.env.DISCORD_TOKEN);