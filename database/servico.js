const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Agendamento = require("./models/agendamento");

const Servico = connection.define("servico", {
  nome: {
    type: DataTypes.STRING(130),
    allowNull: false, 
  },
  preço: {
    type: DataTypes.FLOAT,
    allowNull: false,

  },
});

Servico.belongsToMany(Agendamento, { through: 'ServicoAgendamento' });
Agendamento.belongsToMany(Servico, { through: 'ServicoAgendamento' });


module.exports = Servico;