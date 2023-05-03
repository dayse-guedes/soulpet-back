

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

router.delete("/pedidos/:id", async (req, res) => {
  // Precisamos checar se o pet existe antes de apagar
  const pedido = await Pedido.findByPk(req.params.id);

  try {
    if (pedido) {
      // pet existe, podemos apagar
      await pedido.destroy();
      res.json({ message: "O pedido foi removido." });
    } else {
      res.status(404).json({ message: "O pedido não foi encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});
router.delete("/pedidos/clientes/:id", async (req, res) => {
  // Precisamos checar se o pet existe antes de apagar
  const pedidos = await Pedido.findAll({ where: { clienteId: req.params.id } });

  try {
    if (pedidos) {
      for (const pedido of pedidos) {
        pedido.destroy()
      }
      
      res.json({ message: "O pedido foi removido." });
    } else {
      res.status(404).json({ message: "O pedido não foi encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});
router.delete("/pedidos/produto/:id", async (req, res) => {
  const pedidos = await Pedido.findAll({ where: { produtoId: req.params.id } });

  try {
    if (pedidos) {
      for (const pedido of pedidos) {
        pedido.destroy()
      }
      
      res.json({ message: "O pedido foi removido." });
    } else {
      res.status(404).json({ message: "O pedido não foi encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;
