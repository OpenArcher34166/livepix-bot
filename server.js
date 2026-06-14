const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

// =========================
// 🌐 EXPRESS (WEBHOOK + RENDER)
// =========================
const app = express();
app.use(express.json());

// =========================
// 🔥 WEBHOOK LIVEPIX
// =========================
app.post("/webhook/livepix", async (req, res) => {
  try {
    const data = req.body;

    console.log("💰 Webhook recebido:", data);

    const nome = data.nome_pix;
    const id = data.id_freefire;
    const valor = Number(data.valor);

    if (!nome || !id || !valor) {
      return res.status(400).send("Dados inválidos");
    }

    const filaController = require("./src/controllers/filaController");

    await filaController.adicionar(nome, id, valor);

    return res.status(200).send("OK");
  } catch (err) {
    console.log("Erro webhook:", err);
    return res.status(500).send("error");
  }
});

// =========================
// 🌐 PORTA RENDER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 Servidor rodando na porta", PORT);
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