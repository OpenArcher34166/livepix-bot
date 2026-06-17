const atualizarPainel = require("../utils/atualizarPainel");

module.exports = (client) => {
  client.once("ready", async () => {
    try {

      console.log(`🤖 Bot online como ${client.user.tag}`);

      console.log("READY EXECUTADO");

      // NÃO BUSCA MAIS CANAL FIXO
      // const canal = await client.channels.fetch("1515543183688208404");

      // NÃO ATUALIZA PAINEL POR ENQUANTO
      // await atualizarPainel(client);

      console.log("BOT PRONTO");

    } catch (err) {
      console.error("ERRO READY:");
      console.error(err);
    }
  });
};