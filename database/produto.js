const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Produto = connection.define(
    "produto",
    new Schema({
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        preco: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        desconto: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        dataDesconto: {
            type: Date,
            allowNull: false
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
);

module.exports = Produto;