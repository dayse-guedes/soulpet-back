const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const { Servico } = require("./models/servico");
const { Cliente } = require ("./models/cliente");

const Agendamento = connection.define("agendamento", {
  dataAgendada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  realizada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

Agendamento.belongsToMany(Servico, { through: "ServicoAgendamento" });
Agendamento.belongsToMany(Cliente, { through: "ClienteAgendamento" });
Servico.belongsToMany(Agendamento, { through: "ServicoAgendamento" });
Cliente.belongsToMany(Agendamento, { through: "ClienteAgendamento" });

module.exports = Agendamento;
