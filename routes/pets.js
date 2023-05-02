const Cliente = require("../database/cliente");
const Pet = require("../database/pet");

const { Router } = require("express");

// Criar o grupo de rotas (/pets)
const router = Router();

router.get("/pets", async (req, res) => {
   // Receber o número da página, quando não é enviado o número da página é atribuido página 1
   const { page = 1 } = req.query;
   //console.log(page);

   // Limite de registros em cada página
   const limit = 5;

   // Variável com o número da última página
   var lastPage = 1;

   // Contar a quantidade de registro no banco de dados
   const countPets = await Pet.count();
   //console.log(countPets);

   // Acessa o IF quando encontrar registro no banco de dados
   if (countPets !== 0) {
       // Calcular a última página
       lastPage = Math.ceil(countPets / limit);
       //console.log(lastPage);
   } else {
       // Pausar o processamento e retornar a mensagem de erro
       return res.status(400).json({
           mensagem: "Erro: Nenhum usuário encontrado!"
       });
   }

   //console.log((page * limit) - limit); // 3 * 10 - 10 = 20
   // Recuperar todos os usuário do banco de dados
   const pets = await Pet.findAll({

       // Indicar quais colunas recuperar
       attributes: ['id', 'nome', 'tipo', 'porte', 'dataNasc'],

       // Ordenar os registros pela coluna id na forma decrescente
       order: [['id', 'ASC']],

       // Calcular a partir de qual registro deve retornar e o limite de registros
       offset: Number((page * limit) - limit),
       limit: limit
   });

   // Acessa o IF se encontrar o registro no banco de dados
   if (pets) {
       // Criar objeto com as informações para paginação
       var pagination = {
           // Caminho
           path: '/pets',
           // Página atual
           page,
           // URL da página anterior
           prev_page_url: page - 1 >= 1 ? page - 1 : false,
           // URL da próxima página
           next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
           // Última página
           lastPage,
           // Quantidade de registros
           total: countPets
       }

       // Pausar o processamento e retornar os dados em formato de objeto
       return res.json({
           pets,
           pagination
       });
   } else {
       // Pausar o processamento e retornar a mensagem de erro
       return res.status(400).json({
           mensagem: "Erro: Nenhum usuário encontrado!"
       });
   }
});

router.get("/pets/:id", async (req, res) => {
  const { id } = req.params;

  const pet = await Pet.findByPk(id);
  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ message: "Pet não encontrado." });
  }
});

router.post("/pets", async (req, res) => {
  const { nome, tipo, porte, dataNasc, clienteId } = req.body;

  try {
    const cliente = await Cliente.findByPk(clienteId);
    if (cliente) {
      const pet = await Pet.create({ nome, tipo, porte, dataNasc, clienteId });
      res.status(201).json(pet);
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

router.put("/pets/:id", async (req, res) => {
  // Esses são os dados que virão no corpo JSON
  const { nome, tipo, dataNasc, porte } = req.body;

  // É necessário checar a existência do Pet
  // SELECT * FROM pets WHERE id = "req.params.id";
  const pet = await Pet.findByPk(req.params.id);

  // se pet é null => não existe o pet com o id
  try {
    if (pet) {
      // IMPORTANTE: Indicar qual o pet a ser atualizado
      // 1º Arg: Dados novos, 2º Arg: Where
      await Pet.update(
        { nome, tipo, dataNasc, porte },
        { where: { id: req.params.id } } // WHERE id = "req.params.id"
      );
      // await pet.update({ nome, tipo, dataNasc, porte });
      res.json({ message: "O pet foi editado." });
    } else {
      // caso o id seja inválido, a resposta ao cliente será essa
      res.status(404).json({ message: "O pet não foi encontrado." });
    }
  } catch (err) {
    // caso algum erro inesperado, a resposta ao cliente será essa
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

router.delete("/pets/:id", async (req, res) => {
  // Precisamos checar se o pet existe antes de apagar
  const pet = await Pet.findByPk(req.params.id);

  try {
    if (pet) {
      // pet existe, podemos apagar
      await pet.destroy();
      res.json({ message: "O pet foi removido." });
    } else {
      res.status(404).json({ message: "O pet não foi encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;
