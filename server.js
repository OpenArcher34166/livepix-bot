const express = require("express");
const filaController = require("./src/controllers/filaController");

const app = express();
app.use(express.json());

// =========================
// 🌐 TESTE DA API
// =========================
app.get("/", (req, res) => {
  res.send("LivePix Bot Online");
});

// =========================
// 💰 WEBHOOK LIVEPIX
// =========================
app.post("/webhook/livepix", async (req, res) => {
  try {
    console.log("💰 RECEBIDO:", req.body);

    const { nome_pix, id_freefire, valor } = req.body;

    // validação básica
    if (!nome_pix || !id_freefire || !valor) {
      return res.status(400).send("dados inválidos");
    }

    const valorNum = Number(valor);

    if (isNaN(valorNum)) {
      return res.status(400).send("valor inválido");
    }

    // 🔥 CHAMADA CORRETA (AGORA CERTO)
    await filaController.adicionar(
      nome_pix,
      id_freefire,
      valorNum,
      0
    );

    return res.status(200).send("OK");

  } catch (err) {
    console.log("❌ ERRO WEBHOOK:", err);
    return res.status(500).send("erro interno");
  }
});

// =========================
// 🚀 PORTA DO RENDER
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