

const { Router } = require("express");
const Pedido = require("../database/pedido");
const Produto = require("../database/produto");
const Cliente = require("../database/cliente");

const router = Router();

router.get("/pedidos", async (req, res, next) => {
  try {
    const response = await Pedido.findAll({
      include: [
        { model: Cliente, as: 'cliente', attributes: ['nome'] },
        { model: Produto, as: 'produto', attributes: ['nome'] },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
router.get("/pedidos/:codigo", async (req, res, next) => {
  const { codigo } = req.params;
  try {
    const response = await Pedido.findAll({
      where: { codigo },
      include: [
        { model: Cliente, as: 'cliente', attributes: ['nome'] },
        { model: Produto, as: 'produto', attributes: ['nome'] },
      ]
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
router.get("/pedidos/produto/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await Pedido.findAll({
      where: { produtoId: id },
      include: [
        { model: Cliente, as: 'cliente', attributes: ['nome'] },
        { model: Produto, as: 'produto', attributes: ['nome'] },
      ]
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
router.get("/pedidos/cliente/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await Pedido.findAll({
      where: { clienteId: id },
      include: [
        { model: Cliente, as: 'cliente', attributes: ['nome'] },
        { model: Produto, as: 'produto', attributes: ['nome'] },
      ]
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/pedidos", async (req, res, next) => {
  const { pedidos } = req.body;
  console.log(pedidos);
  try {
    if (pedidos) {

      const novo = await Pedido.bulkCreate(pedidos);

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

  if (
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
router.delete("/pedidos/:codigo", async (req, res, next) => {
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
