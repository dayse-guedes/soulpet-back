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

Pet.hasMany(Agendamento, { foreignKey: 'petId', as: 'agendamentos' });
Agendamento.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

Servico.hasMany(Agendamento, { foreignKey: 'servicoId', as: 'agendamentos' });
Agendamento.belongsTo(Servico, { foreignKey: 'servicoId', as: 'servico' });



module.exports = Agendamento;
