

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



module.exports = router;
