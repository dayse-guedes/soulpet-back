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

router.delete("/servicos/all", async (req, res) => {
    try {
        await Servico.destroy({ where: {} });
        res.status(200).json({ message: "Todos os servicos foram removidos." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ocorreu um erro." });
    }
});

router.put("/servicos/:id", async (req, res) => {
    const { nome, preco } = req.body;
    const servico = await Servico.findByPk(req.params.id);

    try {
        if (servico) {
            await Servico.update(
                { nome, preco },
                { where: { id: req.params.id } }
            );
            res.json({ message: "O serviço foi editado." });
        } else {
            res.status(404).json({ message: "O serviço não foi encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

router.delete("/servicos/:id", async (req, res) => {

    const { id } = req.params;

    const servico = await Servico.findOne({ where: { id } });
    try {
        if (servico) {
            await servico.destroy();
            res.status(200).json({ message: "O Servico foi removido." });
        } else {
            res.status(404).json({ message: "O Servico não foi encontrado." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ocorreu um erro." });
    }
});

module.exports = router;