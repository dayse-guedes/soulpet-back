const { Router } = require("express");
const Produto = require("../database/produto");

const router = Router();

router.post("/produtos", async (req, res) => {
  const { nome, preco, descricao, desconto, dataDesconto, categoria } = req.body;

  if (
    !nome ||
    !preco ||
    !descricao ||
    !desconto ||
    !dataDesconto ||
    !categoria
  ) {
    return res.status(400).json({ message: "Campo obrigatório não informado" });
  }
  if (
    categoria !== "Brinquedos" &&
    categoria !== "Conforto" &&
    categoria !== "Higiene"
  ) {
    return res.status(400).json({ message: "Categoria invalida" });
  }
  const dataAtual = new Date();
  const dataComparar = new Date(Date.parse(dataDesconto));

  if (dataComparar < dataAtual) {
    return res.status(400).json({ message: "Data expirada" });
  }
  if (desconto < 0 || desconto > 100) {
    return res.status(400).json({ message: "Desconto inválido" });
  }
  try {
    const produto = await Produto.create({
      nome,
      preco,
      descricao,
      desconto,
      dataDesconto,
      categoria
    });
    res.status(201).json(produto);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

router.put("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, desconto, dataDesconto, categoria } = req.body;

  if (!id || !nome || !preco || !descricao || !desconto || !dataDesconto || !categoria) {
    return res.status(400).json({ message: "Campo obrigatório não informado" });
  }

  const produto = await Produto.findByPk(id);
  if (!produto) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }

  if (categoria !== "Brinquedos" && categoria !== "Conforto" && categoria !== "Higiene") {
    return res.status(400).json({ message: "Categoria invalida" });
  }

  const dataAtual = new Date();
  const dataComparar = new Date(Date.parse(dataDesconto));

  if (dataComparar < dataAtual) {
    return res.status(400).json({ message: "Data expirada" });
  }

  if (desconto < 0 || desconto > 100) {
    return res.status(400).json({ message: "Desconto inválido" });
  }

  try {
    const produtoAtualizado = await produto.update({
      nome,
      preco,
      descricao,
      desconto,
      dataDesconto,
      categoria
    });

    res.status(201).json(produtoAtualizado);
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

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