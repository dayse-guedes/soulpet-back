const { Router } = require("express");
const Produto = require("../database/produto");

const router = Router();

router.delete("/produtos/all", async (req, res) => {
    try {
      await Produto.destroy({ where: {} });
      res.status(200).json({ message: "Todos os produtos foram removidos." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ocorreu um erro." });
    }
  });

router.delete("/produtos/:id", async (req, res) => {
   
    const { id } = req.params;
    
    const produto = await Produto.findOne({ where: { id } });
    try {
      if (produto) {
        await produto.destroy();
        res.status(200).json({ message: "O Produto foi removido." });
      } else {
        res.status(404).json({ message: "O Produto não foi encontrado." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ocorreu um erro." });
    }
});


module.exports = router;