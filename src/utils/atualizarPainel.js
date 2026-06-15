const filaController = require("../controllers/filaController");

const CANAL_FILA = "1515543183688208404";

async function atualizarPainel(client) {
  try {
    const canal = await client.channels.fetch(CANAL_FILA);

    if (!canal) return;

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

    const mensagem =
`📋 FILA DE PARTIDAS

${textoFila}

━━━━━━━━━━━━━━━

👥 Jogadores: ${fila.length}
💰 Total arrecadado: R$ ${total.toFixed(2)}

🔄 Atualização automática`;

    const mensagens = await canal.messages.fetch({ limit: 20 });

    const painelExistente = mensagens.find(
      m => m.author.id === client.user.id
    );

    if (painelExistente) {
      await painelExistente.edit(mensagem);
    } else {
      await canal.send(mensagem);
    }

  } catch (err) {
    console.error("Erro ao atualizar painel:", err);
  }
}

module.exports = atualizarPainel;