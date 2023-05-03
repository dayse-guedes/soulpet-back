const { Router } = require("express");
const Produto = require("../database/produto");

const router = Router();

// Realiza a Busca de todos 
router.get("/produtos", async (req, res, next) => {
  try {
      const listaProdutos = await Produto.findAll();
      res.status(201).json(listaProdutos);
  } catch (err) {
      console.log(err);
      next(err)
    }
});

//Realiza a Busca por nome ou categoria
router.get("/produto", async (req, res, next) => {

  const { nome, categoria } = req.query;
  const where = nome ? { nome: { [Op.like]: `%${nome}%` } } : { categoria: { [Op.like]: `%${categoria}%` } };

  try {
      const produtos = await Produto.findAll({ where });

      if (produtos.length > 0) {
          res.status(200).json({ listaProdutos: produtos });
      } else {
          res.status(404).json({ message: "Nenhum produto encontrado!" });
      }

  } catch (err) {
      console.log(err);
      next(err)
    };
});

//lista por id
router.get("/produtos/:id", async (req, res, next) => {

  const produto = await Produto.findOne({
      where: { id: req.params.id }
  });

  try {
      if (produto) {
          res.status(201).json(produto);
      } else {
          res.status(404).json({ message: "Produto não encontrado." });
      }
  } catch (err) {
    console.error(err)  
    next(err)
    }
});

router.post("/produtos", async (req, res, next) => {
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
    console.error(err);
    next(err)
  }
});

router.put("/produtos/:id", async (req, res, next) => {
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
    console.error(err);
    next(err)
  }
});

router.delete("/produtos/all", async (req, res, next) => {
  try {
    await Produto.destroy({ where: {} });
    res.status(200).json({ message: "Todos os produtos foram removidos." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ocorreu um erro." });
    next(err)
  }
});

router.delete("/produtos/:id", async (req, res, next) => {

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
    next(err)
  }
});


module.exports = router;