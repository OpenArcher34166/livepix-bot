const filaController = require("../controllers/filaController");
const servidorModel = require("../models/servidorModel");

async function atualizarPainel(client, guildId) {

console.log("GUILD ID RECEBIDO:", guildId);  
  try {

    console.log("🔄 INICIANDO ATUALIZAÇÃO DO PAINEL");

    const config = await servidorModel.buscar(guildId);

    if (!config) {
      console.log("❌ Servidor não configurado");
      return;
    }

    const canal = await client.channels.fetch(
      config.canal_fila
    );

    if (!canal) {
      console.log("❌ Canal da fila não encontrado");
      return;
    }

    console.log("📌 Canal encontrado:", canal.name);

    const fila = await filaController.listar();

    let total = 0;

    const textoFila = fila.length
      ? fila.map((j, i) => {

          total += Number(j.valor || 0);

          return `${i + 1}️⃣ ${j.nome_pix}
ID: ${j.id_freefire}
🎮 Partidas: ${j.partidas}`;

        }).join("\n\n")
      : "Nenhum jogador na fila.";

    const mensagem = `📋 FILA DE PARTIDAS

${textoFila}

━━━━━━━━━━━━━━━

👥 Jogadores: ${fila.length}
💰 Total arrecadado: R$ ${total.toFixed(2)}

🔄 Atualização automática`;

    const mensagens =
      await canal.messages.fetch({
        limit: 20
      });

    const painelExistente = mensagens.find(
      m => m.author.id === client.user.id
    );

    if (painelExistente) {

      await painelExistente.edit(
        mensagem
      );

      console.log("✅ Painel atualizado");

    } else {

      await canal.send(
        mensagem
      );

      console.log("✅ Painel criado");
    }

  } catch (err) {

    console.error(
      "❌ ERRO AO ATUALIZAR PAINEL:"
    );

    console.error(err);
  }
}

module.exports = atualizarPainel;