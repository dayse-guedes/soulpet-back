

const { Router } = require("express");
const Pedido = require("../database/pedido");

const router = Router();

router.post("/pedidos", async (req, res, next) => {
const {quantidade,clienteId,produtoId} = req.body;
try {
    
    const novo = await Pedido.create(
      { quantidade,clienteId,produtoId}
    );

    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    next(err)
  }
});

router.put("/pedidos/:codigo", async (req, res, next) => {
  const { clienteId, produtoId, quantidade } = req.body;
  const { codigo } = req.params;

  if(
    !clienteId ||
    !produtoId || 
    !quantidade
  ) {
    return res.status(400).json({ message: "Campo obrigatório não informado" });
  }
  try {
    const pedido = await Pedido.findOne({ where: { codigo } });
    if (pedido) {
        await pedido.update({ clienteId, produtoId, quantidade });
      res.status(200).json({ message: "Pedido atualizado." });
    } else {
      res.status(404).json({ message: "Pedido não encontrado." });
    }
  } catch (err) {
    console.error(err);
    next(err)
  }
});



module.exports = router;
