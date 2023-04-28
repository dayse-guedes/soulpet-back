const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const  Servico  = require("./servico");
const  Pet  = require ("./pet");

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

Servico.hasMany(Agendamento);
Agendamento.belongsTo(Servico);
Pet.hasMany(Agendamento);
Agendamento.belongsTo(Pet);



module.exports = Agendamento;
