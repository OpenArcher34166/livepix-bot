const express = require("express");
const filaController = require("./src/controllers/filaController");

const app = express();

// =========================
// 🔧 MIDDLEWARES (RENDER SAFE)
// =========================
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// =========================
// 🔥 LOG DE START
// =========================
console.log("🔥 SERVER INICIADO");

// =========================
// 🌐 HEALTH CHECK (IMPORTANTE NO RENDER)
// =========================
app.get("/", (req, res) => {
  res.status(200).send("LivePix Bot Online");
});

// =========================
// 💰 WEBHOOK LIVEPIX
// =========================
app.post("/webhook/livepix", async (req, res) => {
  console.log("🔥 CHEGOU NO WEBHOOK");
  console.log("BODY:", req.body);

  try {
    const { nome_pix, id_freefire, valor } = req.body || {};

    // validação forte (evita crash)
    if (!nome_pix || !id_freefire || valor === undefined) {
      console.log("❌ DADOS INVÁLIDOS");
      return res.status(400).send("dados inválidos");
    }

    const valorNum = Number(valor);

    if (!Number.isFinite(valorNum)) {
      console.log("❌ VALOR INVÁLIDO");
      return res.status(400).send("valor inválido");
    }

    // chama controller
    await filaController.adicionar(
      nome_pix,
      id_freefire,
      valorNum,
      0
    );

    console.log("✅ PROCESSADO COM SUCESSO");
    return res.status(200).send("OK");

  } catch (err) {
    console.log("🔥 ERRO NO WEBHOOK");
    console.log(err?.message);
    console.log(err?.stack);

    return res.status(500).send("erro interno");
  }
});

// =========================
// 🚀 START SERVER (RENDER SAFE)
// =========================
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("🌐 Express rodando na porta", PORT);
});

// evita crash silencioso no Render
process.on("unhandledRejection", (err) => {
  console.log("❌ UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.log("❌ UNCAUGHT EXCEPTION:", err);
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