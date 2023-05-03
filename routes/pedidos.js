

const { Router } = require("express");
const Pedido = require("../database/pedido");
const Produto = require("../database/produto");

const router = Router();

router.post("/pedidos", async (req, res, next) => {
  const { quantidade, clienteId, produtoId } = req.body;
  try {
    if (quantidade && clienteId && produtoId) {

      const novo = await Pedido.create(
        { quantidade, clienteId, produtoId }
      );

      res.status(201).json(novo);

    } else {
      res.status(400).json("dados invalidos")
    }
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


router.delete("/pedidos/:codigo", async (req, res,next) => {
  const { codigo } = req.params;
  const pedido = await Pedido.findByPk(codigo);

  try {
    if (pedido) {
      await pedido.destroy();
      res.json({ message: "O pedido foi removido." });
    } else {
      res.status(404).json({ message: "O pedido não foi encontrado" });
    }
  } catch (err) {
    console.log(err);
    next(err)
  }
});
router.delete("/pedidos/clientes/:id", async (req, res, next) => {
  const pedidos = await Pedido.findAll({ where: { clienteId: req.params.id } });

  try {
    if (pedidos) {
      for (const pedido of pedidos) {
        pedido.destroy()
      }
      
      res.json({ message: "Os pedidos foram removidos." });
    } else {
      res.status(404).json({ message: "Os pedidos não foram encontrados" });
    }
  } catch (err) {
    console.log(err);
    next(err)
  }
});
router.delete("/pedidos/produto/:id", async (req, res, next) => {
  const pedidos = await Pedido.findAll({ where: { produtoId: req.params.id } });

  try {
    if (pedidos) {
      for (const pedido of pedidos) {
        pedido.destroy()
      }
      
      res.json({ message: "Os pedidos foram removidos." });
    } else {
      res.status(404).json({ message: "Os pedidos não foram encontrados" });
    }
  } catch (err) {
    console.log(err);
    next(err)
  }
});

module.exports = router;
