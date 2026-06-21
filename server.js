const express = require("express");
const filaController = require("./src/controllers/filaController");
const atualizarPainel = require("./src/utils/atualizarPainel");

const app = express();

// =========================
// 🔧 MIDDLEWARES
// =========================
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

console.log("🔥 SERVER INICIADO");

// =========================
// 🌐 ROTA TESTE
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
      return res.status(400).send("dados inválidos");
    }

    const valorNum = Number(valor);

    if (isNaN(valorNum)) {
      return res.status(400).send("valor inválido");
    }

    // Salva no banco
    await filaController.adicionar(
      nome_pix,
      id_freefire,
      valorNum
    );

    // Atualiza o painel do Discord
    if (client?.isReady()) {
const guild = client.guilds.cache.first();

if (guild) {
  await atualizarPainel(
    client,
    guild.id
  );
}    }

    console.log("✅ PROCESSADO COM SUCESSO");

    return res.status(200).send("OK");

  } catch (err) {
    console.log("🔥🔥🔥 ERRO REAL COMPLETO 🔥🔥🔥");
    console.log(err);
    console.log(err?.stack);

    return res.status(500).send({
      message: err?.message
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

client.login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log("✅ LOGIN DISCORD ENVIADO");
  })
  .catch((err) => {
    console.error("❌ ERRO LOGIN DISCORD:");
    console.error(err);
  });