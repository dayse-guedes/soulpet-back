

const { Router } = require("express");
const Pedido = require("../database/pedido");

const router = Router();

router.post("/pedidos", async (req, res, next) => {
const {quantidade,clienteId,produtoId} = req.body;
try {
    if (quantidade && clienteId && produtoId) {
      
      const novo = await Pedido.create(
        { quantidade,clienteId,produtoId}
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

module.exports = router;
