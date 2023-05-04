const { Router } = require("express");
const Cliente = require("../database/cliente");
const Pet = require("../database/pet");
const Produto = require("../database/produto");
const Servico = require("../database/servico");
const Agendamento = require("../database/agendamento");
const Pedido = require("../database/pedido");
const router = Router();


router.get('/dashboard', async (req, res, next) => {
    const clientes = (await Cliente.findAndCountAll()).count
    const pets = (await Pet.findAndCountAll()).count
    const produtos = (await Produto.findAndCountAll()).count
    const servicos = (await Servico.findAndCountAll()).count
    const agendamentos = (await Agendamento.findAndCountAll()).count
    const pedidos = (await Pedido.findAndCountAll()).count

    const totais = {clientes:clientes,
        pets: pets,
        produtos: produtos,
        servicos: servicos,
        agendamentos: agendamentos,
        pedidos: pedidos
    }
    res.json(totais);

})
module.exports = router;