// Importações principais e variáveis de ambiente
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const LogMorgan = require("./model/LogMorgan");
const mongoose = require("mongoose");
const Agendamento = require("./database/agendamento");
const Cliente = require("./database/cliente");
const Produto = require("./database/produto");
const Servico = require("./database/servico");
const Endereco = require("./database/endereco");
const Pet = require("./database/pet");
const Pedido = require("./database/pedido");

// Configuração do App
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON

// Configurações de acesso
app.use(cors({ origin: "http://localhost:3000" }));

// Configuração do Banco de Dados MySQL
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão

// Importação do trigger
const createTrigger = require("./database/triggers");

// Configuração de conexão com o MongoDB
mongoose.connect(process.env.db_url);
app.use(
  morgan("combined", {
    stream: {
      write: async function (log) {
        try {
          const novoLog = new LogMorgan({ log });
          await novoLog.save();
        } catch (err) {
          console.log(err);
        }
      },
    },
  })
);

// Definição de Rotas
const rotasClientes = require("./routes/clientes");
const rotasPets = require("./routes/pets");
const rotasServicos = require("./routes/servicos");
const rotasAgendamentos = require("./routes/agendamentos");
const rotasPedidos = require("./routes/pedidos");
const rotasProdutos = require("./routes/produtos");
const errorHandler = require("./model/error-handler");

// Juntar ao app as rotas dos arquivos
app.use(rotasClientes); // Configurar o grupo de rotas no app
app.use(rotasPets);
app.use(rotasServicos);
app.use(rotasAgendamentos);
app.use(rotasPedidos);
app.use(rotasProdutos);
app.use(errorHandler);

(async () => {
  try {
    const dbForce = process.env.DB_FORCE;
    if (dbForce == "true") {
      connection
        .sync({ force: true })
        .then(async () => {
          await Cliente.bulkCreate([
            {
              nome: "João",
              email: "joao@example.com",
              telefone: "(11) 9999-9999",
            },
            {
              nome: "Maria",
              email: "maria@example.com",
              telefone: "(11) 8888-8888",
            },
            {
              nome: "Pedro",
              email: "pedro@example.com",
              telefone: "(11) 7777-7777",
            },
          ]);
          await Endereco.bulkCreate([
            {
              rua: "Rua A",
              numero: "100",
              cidade: "São Paulo",
              estado: "SP",
              uf: "SP",
              cep: "123456789",
              clienteId: 1,
            },
            {
              rua: "Rua A",
              numero: "100",
              cidade: "São Paulo",
              estado: "SP",
              uf: "SP",
              cep: "123456789",
              clienteId: 2,
            },
            {
              rua: "Rua A",
              numero: "100",
              cidade: "São Paulo",
              estado: "SP",
              uf: "SP",
              cep: "123456789",
              clienteId: 3,
            },
          ]);
          await Produto.bulkCreate([
            {
              nome: "Ração para cães",
              preco: 50,
              descricao: "Ração para cães adultos",
              desconto: 0.2,
              dataDesconto: "2010-01-01",
              categoria: "Alimentos",
            },
            {
              nome: "Coleira",
              preco: 30,
              descricao: "Coleira para cães",
              desconto: 0.5,
              dataDesconto: "2010-01-01",
              categoria: "Acessórios",
            },
            {
              nome: "Cama para gatos",
              preco: 100,
              descricao: "Cama para gatos",
              desconto: 1,
              dataDesconto: "2010-01-01",
              categoria: "Móveis",
            },
          ]);
          await Pet.bulkCreate([
            {
              nome: "Rex",
              tipo: "Cão",
              porte: "pequenho",
              dataNasc: "2023/05/05",
              idade: 3,
              clienteId: 1,
            },
            {
              nome: "Mel",
              tipo: "Gato",
              porte: "medio",
              dataNasc: "2023/05/05",
              idade: 2,
              clienteId: 1,
            },
            {
              nome: "Nina",
              tipo: "Cão",
              porte: "grande",
              dataNasc: "2023/05/05",
              idade: 1,
              clienteId: 2,
            },
          ]);
          await Pedido.bulkCreate([
            { quantidade: 2, valor: 100, clienteId: 1, produtoId: 1 },
            { quantidade: 1, valor: 30, clienteId: 2, produtoId: 1 },
            { quantidade: 3, valor: 300, clienteId: 3, produtoId: 2 },
          ]);
          await Servico.bulkCreate([
            { nome: "tosa", preco: 100 },
            { nome: "banho", preco: 70 },
            { nome: "passeio", preco: 30 },
          ]);
          await Agendamento.bulkCreate([
            {
              dataAgendada: "2023/06/06",
              realizada: true,
              petId: 1,
              servicoId: 2,
            },
            {
              dataAgendada: "2023/06/06",
              realizada: false,
              petId: 3,
              servicoId: 3,
            },
            {
              dataAgendada: "2023/06/06",
              realizada: true,
              petId: 2,
              servicoId: 2,
            },
          ]);
        })
        .catch((err) => {
          console.error("Erro ao sincronizar banco de dados", err);
        });
    } else {
      connection.sync();
    }
    await createTrigger();
    app.listen(3001, () => {
      console.log("Servidor rodando em http://localhost:3001/");
    });
  } catch (err) {
    console.error("Erro ao criar trigger e iniciar o servidor:", err);
  }
})();
