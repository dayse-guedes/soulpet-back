const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");
const Pet = require("../database/pet");
const path = require('path')
const ejs = require('ejs')

const { Router } = require("express");

// Criar o grupo de rotas (/clientes)
const router = Router();

// Definição de rotas
router.get("/clientes", async (req, res) => {
  // SELECT * FROM clientes
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});
router.get('/pdf', async (re, res) => {
  const listaClientes = await Cliente.findAll({
    include: [Pet]
  })

  const filePath = path.join(__dirname, "print.ejs")
  ejs.renderFile(filePath, { listaClientes }, (err, html) => {
    if (err) {
      return res.send('Erro na leitura do arquivo')
    }

    // enviar para o navegador
    return res.send(html)
  })

})

// /clientes/1, 2
router.get("/clientes/:id", async (req, res) => {
  // SELECT * FROM clientes WHERE id = 1;
  const cliente = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco], // trás junto os dados de endereço
  });

  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Usuário não encontrado." });
  }
});
router.get("/clientes/:clienteId/pets", async (req, res) => {
  // SELECT * FROM clientes WHERE id = 1;
  const clienteId = await Pet.findAll({
    where: { clienteId: req.params.clienteId },
  });

  if (clienteId) {
    res.json(clienteId);
  } else {
    res.status(404).json({ message: "Usuário não encontrado." });
  }
});

router.get("/clientes/:clienteId/endereco", async (req, res) => {
  const endereco = await Endereco.findOne({
    where: { clienteId: req.params.clienteId },
  });

  if (endereco) {
    res.json(endereco);
  } else {
    res.status(404).json({ message: "Endereço não encontrado." });
  }
});


router.post("/clientes", async (req, res, next) => {
  // Coletar os dados do req.body
  const { nome, email, telefone, endereco } = req.body;

  try {
    // Dentro de 'novo' estará o o objeto criado
    const novo = await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] }
    );

    res.status(201).json(novo);
  } catch (err) {
    console.error(err)
    next(err)
  }
});

// atualizar um cliente
router.put("/clientes/:id", async (req, res, next) => {
  // obter dados do corpo da requisão
  const { nome, email, telefone, endereco } = req.body;
  // obter identificação do cliente pelos parametros da rota
  const { id } = req.params;
  try {
    // buscar cliente pelo id passado
    const cliente = await Cliente.findOne({ where: { id } });
    // validar a existência desse cliente no banco de dados
    if (cliente) {
      // validar a existência desse do endereço passdo no corpo da requisição
      if (endereco) {
        await Endereco.update(endereco, { where: { clienteId: id } });
      }
      // atualizar o cliente com nome, email e telefone
      await cliente.update({ nome, email, telefone });
      res.status(200).json({ message: "Cliente editado." });
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (err) {
    console.error(err);
    next(err)
  }
});

// excluir um cliente
router.delete("/clientes/:id", async (req, res, next) => {
  // obter identificação do cliente pela rota
  const { id } = req.params;
  // buscar cliente por id
  const cliente = await Cliente.findOne({ where: { id } });
  try {
    if (cliente) {
      await Pet.destroy({where: {clienteId:id}});
      await Endereco.destroy({where: {clienteId:id}});
      await cliente.destroy();
      res.status(200).json({ message: "Cliente removido." });
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (err) {
    console.error(err);
    next(err)
  }
});


module.exports = router;
