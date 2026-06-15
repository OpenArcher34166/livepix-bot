const atualizarPainel = require("../utils/atualizarPainel");

module.exports = (client) => {
  client.once("ready", async () => {
    try {

      console.log(`🤖 Bot online como ${client.user.tag}`);

      const canal = await client.channels.fetch("1515543183688208404");

      console.log("CANAL ENCONTRADO:");
      console.log(canal?.name);
      console.log(canal?.id);

      await atualizarPainel(client);

      console.log("PAINEL EXECUTADO");

    } catch (err) {
      console.error("ERRO READY:");
      console.error(err);
    }
  });
};