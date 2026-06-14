const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

// =========================
// 🌐 MINI SERVER (Render)
// =========================
const app = express();

app.get("/", (req, res) => {
  res.send("🤖 Bot LivePix online!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🌐 Servidor web rodando na porta " + PORT);
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