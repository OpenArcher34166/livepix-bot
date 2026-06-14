const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const filaController = require("./src/controllers/filaController");

// =========================
// 🌐 EXPRESS SERVER
// =========================
const app = express();
app.use(express.json());

// =========================
// 💰 LIVEPIX WEBHOOK
// =========================
app.post("/webhook/livepix", async (req, res) => {
  try {
    const data = req.body;

    console.log("💰 Webhook recebido:", data);

    const nome = data.nome_pix;
    const id = data.id_freefire;
    const valor = Number(data.valor);

    if (!nome || !id || isNaN(valor) || valor <= 0) {
      return res.status(400).send("Dados inválidos");
    }

    // 🔥 REGRA PROFISSIONAL:
    // valor vira crédito, partidas podem ser calculadas depois
    await filaController.adicionarJogador(
      nome,
      id,
      valor,
      0 // partidas iniciais (ou você pode calcular depois)
    );

    return res.status(200).send("OK");
  } catch (err) {
    console.log("❌ ERRO WEBHOOK:", err);
    return res.status(500).send("erro interno");
  }
});

// =========================
// 🌐 ROTA DE TESTE (OPCIONAL)
// =========================
app.get("/", (req, res) => {
  res.send("🤖 LivePix Bot Online");
});

// =========================
// 🚀 PORTA RENDER
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