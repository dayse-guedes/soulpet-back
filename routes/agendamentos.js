const Agendamento = require("../database/agendamento");
const Pet = require("../database/pet");
const Servico = require("../database/servico");


const { Router } = require("express");
const router = Router();

router.get("/agendamentos", async (req, res) => {
  try{
    const agendamentos = await Agendamento.findAll();
    res.status(200).json(agendamentos);
  } catch(err){
    res.status(500).json({message: "Um erro aconteceu."})
  }
});

router.post("/agendamentos", async (req, res) => {
  try {
    const { petId, servicoId, dataAgendada, realizada } = req.body;

    const pet = await Pet.findByPk(petId);
    const servico = await Servico.findByPk(servicoId);

    if (!pet || !servico) {
      return res.status(404).send("Pet ou Serviço não encontrado");
    }

    const agendamento = await Agendamento.create({
      petId,
      servicoId,
      dataAgendada,
      realizada,
    });

    res.status(201).json(agendamento);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar agendamento");
  }
});

module.exports = router;