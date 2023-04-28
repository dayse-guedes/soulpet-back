const { DataTypes } = require("sequelize");
const { connection } = require("./database");

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
module.exports = Servico;