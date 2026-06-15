const filaController = require("../controllers/filaController");

const CANAL_FILA = "1515543183688208404";

async function atualizarPainel(client) {
  try {
    console.log("🔄 INICIANDO ATUALIZAÇÃO DO PAINEL");

    const canal = await client.channels.fetch(CANAL_FILA);

    console.log("📌 Canal encontrado:", canal?.name);
    console.log("📌 Tipo:", canal?.type);

    if (!canal) {
      console.log("❌ Canal não encontrado");
      return;
    }

    const fila = await filaController.listar();

    console.log("📋 Jogadores encontrados:", fila.length);

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

    console.log("📝 Mensagem gerada:");
    console.log(mensagem);

    const mensagens = await canal.messages.fetch({ limit: 20 });

    console.log("📨 Mensagens encontradas:", mensagens.size);

    const painelExistente = mensagens.find(
      m => m.author.id === client.user.id
    );

    if (painelExistente) {
      console.log("✏️ Editando painel existente");
      await painelExistente.edit(mensagem);
      console.log("✅ Painel atualizado");
    } else {
      console.log("📤 Enviando novo painel");
      await canal.send(mensagem);
      console.log("✅ Painel enviado");
    }

  } catch (err) {
    console.error("❌ ERRO AO ATUALIZAR PAINEL:");
    console.error(err);
    console.error(err.stack);
  }
}

module.exports = atualizarPainel;