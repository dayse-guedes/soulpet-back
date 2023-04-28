const { Router } = require("express");
const Servico = require("../database/servico");

// Criar o grupo de rotas (/clientes)
const router = Router();



router.get("/servicos", async (req, res) => {

    const Servicos = await Servico.findAll();
    res.json(Servicos);
});
router.get("/servicos/:id", async (req, res) => {
    const { id } = req.params;

    const servico = await Servico.findByPk(id);
    if (servico) {
        res.json(servico);
    } else {
        res.status(404).json({ message: "servico não encontrado." });
    }
});

router.post("/servicos", async (req, res) => {

    const { nome, preco } = req.body;

    try {
        if (nome, preco) {
            const novoServico = await Servico.create({ nome, preco });
            res.status(201).json(novoServico);
        } else {
            res.json({ message: "Nome ou preco invalido" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }

});

module.exports = router;