const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const { Servico } = require("./servico");
const { Pet } = require ("./pet");

const Agendamento = connection.define("agendamento", {
  ServicoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Servico, 
      key: "id",
    }
  },
  PetId: {
    type: DataTypes.INTEGER,
    references: {
      model: Pet, 
      key: "id",
    }
  },
  dataAgendada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  realizada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

Servico.belongsToMany(Pet, { through: "Agendamento" });
Pet.belongsToMany(Servico, { through: "Agendamento" });


module.exports = Agendamento;
