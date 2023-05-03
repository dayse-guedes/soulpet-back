

const { Router } = require("express");
const Pedido = require("../database/pedido");

const router = Router();

router.post("/pedidos", async (req, res) => {
const {quantidade,clienteId,produtoId} = req.body;
try {
    if (quantidade && clienteId && produtoId) {
      
    
    const novo = await Pedido.create(
      { quantidade,clienteId,produtoId}
    );

    res.status(201).json(novo);
  }else{
    res.status(400).json("dados invalidos")
  }

  }
   catch (err) {
    console.log(err);

    res.status(500).json({ message: "Um erro aconteceu." });
  }
});



module.exports = router;
