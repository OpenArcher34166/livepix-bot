const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const filaController = require("./src/controllers/filaController");

const app = express();
app.use(express.json());

// =========================
// 🌐 WEBHOOK LIVEPIX
// =========================
app.post("/webhook/livepix", async (req, res) => {
  try {
    console.log("💰 WEBHOOK:", req.body);

    const { nome_pix, id_freefire, valor } = req.body;

    if (!nome_pix || !id_freefire || !valor) {
      return res.status(400).send("dados inválidos");
    }

    await filaController.adicionarJogador(
      nome_pix,
      id_freefire,
      Number(valor),
      0
    );

    return res.status(200).send("OK");
  } catch (err) {
    console.log("ERRO WEBHOOK:", err);
    return res.status(500).send("erro");
  }
});

// =========================
// 🌐 TESTE
// =========================
app.get("/", (req, res) => {
  res.send("LivePix Bot Online");
});

// =========================
// 🚀 RENDER PORT
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 Express rodando na porta", PORT);
});

// =========================
// 🤖 DISCORD BOT
// =========================
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