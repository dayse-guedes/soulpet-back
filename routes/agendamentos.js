const Agendamento = require("../database/agendamento");
const Pet = require("../database/pet");
const Servico = require("../database/servico");


const { Router } = require("express");
const router = Router();

router.get('/agendamentos', async (req, res, next) => {
  try {
    const agendamentos = await Agendamento.findAll({
      include: [
        { model: Pet, as: 'pet', attributes: ['nome'] },
        { model: Servico, as: 'servico', attributes: ['nome'] },
      ],
    });
    res.status(200).json(agendamentos);
  } catch (err) {
    console.error(err);
    next(err)
  }
});

router.delete("/agendamentos/all", async (req, res, next) => {
  try {
    await Agendamento.destroy({ where: {} });
    res.status(200).json({ message: "Todos os agendamentos foram removidos." });
  } catch (err) {
    console.error(err);
    next(err)
  }
});

router.delete("/agendamentos/:id", async (req, res, next) => {
  const { id } = req.params;
  const agendamento = await Agendamento.findOne({ where: { id } });
  try {
    if (Agendamento) {
      await agendamento.destroy();
      res.status(200).json({ message: "Agendamento removido." });
    } else {
      res.status(404).json({ message: "Agendamento não encontrado." });
    }
  } catch (err) {
    console.error(err);
    next(err)
  }
});

router.post("/agendamentos", async (req, res, next) => {
  try {
    const { petId, servicoId, dataAgendada} = req.body;

    const pet = await Pet.findByPk(petId);
    const servico = await Servico.findByPk(servicoId);

    if (!pet || !servico) {
      return res.status(404).send("Pet ou Serviço não encontrado");
    }

    const agendamento = await Agendamento.create({
      petId,
      servicoId,
      dataAgendada,
    });

    res.status(201).json(agendamento);
  } catch (err) {
    console.error(err);
    next(err)
  }
});

module.exports = router;