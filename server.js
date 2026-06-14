const express = require("express");
const filaController = require("./src/controllers/filaController");

const app = express();
app.use(express.json());

// TESTE RAIZ
app.get("/", (req, res) => {
  res.send("LivePix Bot Online");
});

// WEBHOOK
app.post("/webhook/livepix", async (req, res) => {
  try {
    const { nome_pix, id_freefire, valor } = req.body;

    console.log("💰 Webhook recebido:", req.body);

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
    console.log("ERRO:", err);
    return res.status(500).send("erro interno");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});