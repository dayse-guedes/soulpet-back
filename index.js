// Importações principais e variáveis de ambiente
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const LogMorgan = require("./model/LogMorgan");
const mongoose = require('mongoose');

// Configuração do App
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON


// Configurações de acesso
app.use(cors({ origin: "http://localhost:3000" }));

// Configuração do Banco de Dados MySQL
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão

// Configuração de conexão com o MongoDB
mongoose.connect(process.env.db_url);
app.use(morgan('combined', { 
  stream: {
    write: async function (log) {
      try {
        const novoLog = new LogMorgan({ log });
        await novoLog.save();
      } catch (err) {
        console.log(err);
      }
    }
  }
}));


// Definição de Rotas
const rotasClientes = require("./routes/clientes");
const rotasPets = require("./routes/pets");
const rotasServicos = require("./routes/servicos");
const rotasAgendamentos = require("./routes/agendamentos");
const errorHandler = require("./model/error-handler");

// Juntar ao app as rotas dos arquivos
app.use(rotasClientes); // Configurar o grupo de rotas no app
app.use(rotasPets);
app.use(rotasServicos);
app.use(rotasAgendamentos);
app.use(errorHandler);


// Escuta de eventos (listen)
app.listen(3001, () => {
  // Gerar as tabelas a partir do model
  // Force = apaga tudo e recria as tabelas
  connection.sync();
  console.log("Servidor rodando em http://localhost:3001/");
});

const rotasProdutos = require("./routes/produtos");
app.use(rotasProdutos);