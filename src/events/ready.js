module.exports = (client) => {

  client.once("clientReady", async () => {

    try {

      console.log("=================================");
      console.log(`🤖 Bot online como ${client.user.tag}`);
      console.log("✅ READY EXECUTADO");
      console.log(`🆔 BOT ID: ${client.user.id}`);
      console.log(`📡 Servidores: ${client.guilds.cache.size}`);
      console.log("=================================");

    } catch (err) {

      console.error("❌ ERRO READY:");
      console.error(err);

    }

  });

};