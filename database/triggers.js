const { connection } = require("./database");

async function createTrigger() {
  try {
    const createTablebackupCliente = {
      type: connection.QueryTypes.RAW,
      query: `CREATE TABLE IF NOT EXISTS backup_cliente (
        id INT PRIMARY KEY ,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
      `

      }
    const createTriggerCliente = {
      type: connection.QueryTypes.RAW,
      query: `
      
CREATE TRIGGER IF NOT EXISTS before_delete_cliente
BEFORE DELETE ON clientes
FOR EACH ROW
BEGIN
INSERT INTO backup_cliente (id, nome, email, telefone, createdAt, updatedAt)
VALUES (OLD.id, OLD.nome, OLD.email, OLD.telefone, OLD.createdAt, OLD.updatedAt);
END;


    `,
    };
    const createTablebackupPet = {
      type: connection.QueryTypes.RAW,
      query: `CREATE TABLE IF NOT EXISTS backup_pet (
        id INT PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        tipo VARCHAR(20) NOT NULL,
        porte VARCHAR(10) NOT NULL,
        dataNasc DATE NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        clienteId INT NOT NULL);
      `
    }

    const createTriggerPet = {
      type: connection.QueryTypes.RAW,
      query: `
CREATE TRIGGER IF NOT EXISTS tr_backup_pet
BEFORE DELETE ON pets
FOR EACH ROW
BEGIN
INSERT INTO backup_pet (id,nome, tipo, porte, dataNasc,createdAt, updatedAt, clienteId)
VALUES (OLD.id,OLD.nome, OLD.tipo, OLD.porte, OLD.dataNasc,OLD.createdAt, OLD.updatedAt, OLD.clienteId);
END;


    `,
    };
    const createTablebackupAgendamento = {
      type: connection.QueryTypes.RAW,
      query: `CREATE TABLE IF NOT EXISTS backup_agendamento (
        id INT PRIMARY KEY,
        dataAgendada TIMESTAMP NOT NULL,
        realizada BOOLEAN NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        petId INT NOT NULL,
        servicoId INT NOT NULL);
      `
    }
    const createTriggerAgendamento = {
      type: connection.QueryTypes.RAW,
      query: ` 
  CREATE TRIGGER IF NOT EXISTS trigger_backup_agendamento
    BEFORE DELETE ON agendamentos
    FOR EACH ROW
    BEGIN
      INSERT INTO backup_agendamento (id,dataAgendada, realizada,createdAt,updatedAt,petId,servicoId)
      VALUES (OLD.id,OLD.dataAgendada, OLD.realizada,OLD.createdAt,OLD.updatedAt,OLD.petId,OLD.servicoId);
    END;
    `,
    };
    const createTablebackupServico = {
      type: connection.QueryTypes.RAW,
      query: `CREATE TABLE IF NOT EXISTS backup_servico (
        id INT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
      `

    }

    const createTriggerServico = {
      type: connection.QueryTypes.RAW,
      query: `
      
      
      CREATE TRIGGER IF NOT EXISTS before_servico_delete
      BEFORE DELETE ON servicos
      FOR EACH ROW
      BEGIN
      INSERT INTO backup_servico (id,nome, preco, createdAt, updatedAt)
      VALUES (OLD.id,OLD.nome, OLD.preco, OLD.createdAt, OLD.updatedAt);
      END
    
    
    `,
    };
    const createTablebackupEndereco = {
      type: connection.QueryTypes.RAW,
      query: `CREATE TABLE IF NOT EXISTS backup_endereco (
        id INT PRIMARY KEY ,
        uf VARCHAR(2) NOT NULL,
        cidade VARCHAR(50) NOT NULL,
        cep VARCHAR(8) NOT NULL,
        rua VARCHAR(50) NOT NULL,
        numero INT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        clienteId INT NOT NULL);
      `
    }

    const createTriggerEndereco = {
      type: connection.QueryTypes.RAW,
      query: `
    CREATE TRIGGER IF NOT EXISTS before_delete_endereco
    BEFORE DELETE ON enderecos
    FOR EACH ROW
    BEGIN
        INSERT INTO backup_endereco (id,uf, cidade, cep, rua, numero,createdAt,updatedAt,clienteId)
        VALUES (OLD.id,OLD.uf, OLD.cidade, OLD.cep, OLD.rua, OLD.numero,OLD.createdAt,OLD.updatedAt,OLD.clienteId);
    END;
    
    
    
    `,
    };
    const createTablebackupProduto = {
      type: connection.QueryTypes.RAW,
      query: `CREATE TABLE IF NOT EXISTS backup_produto (
        id INT PRIMARY KEY ,
        nome VARCHAR(255) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        descricao TEXT,
        desconto DECIMAL(10,2),
        dataDesconto DATE,
        categoria VARCHAR(255),
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL);
    `
    }
    const createTriggerProduto = {
      type: connection.QueryTypes.RAW,
      query: `
  CREATE TRIGGER IF NOT EXISTS backup_produto
  BEFORE DELETE ON produtos
  FOR EACH ROW
  BEGIN
  INSERT INTO backup_produto (id,nome, preco, descricao, desconto, dataDesconto, categoria, createdAt, updatedAt)
  VALUES (OLD.id,OLD.nome, OLD.preco, OLD.descricao, OLD.desconto, OLD.dataDesconto, OLD.categoria, OLD.createdAt, OLD.updatedAt);
  END
    
    
    
    `,
    };
    const createTablebackupPedido = {
      type: connection.QueryTypes.RAW,
      query: `CREATE TABLE IF NOT EXISTS backup_pedido (
        id INT PRIMARY KEY ,
        codigo VARCHAR(255) NOT NULL,
        quantidade INT(11) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        clienteId INT(11) NOT NULL,
        produtoId INT(11) NOT NULL);
    `
    }

    const createTriggerPedido = {
      type: connection.QueryTypes.RAW,
      query: `
  CREATE TRIGGER IF NOT EXISTS backup_pedido
  BEFORE DELETE ON pedidos
  FOR EACH ROW
  BEGIN
  INSERT INTO backup_pedido (codigo, quantidade, createdAt, updatedAt,clienteId, produtoId)
  VALUES (OLD.codigo, OLD.quantidade, OLD.createdAt, OLD.updatedAt, OLD.clienteId, OLD.produtoId);
  END
    
    
    
    `,
    };
    await connection.query(createTablebackupServico);
    await connection.query(createTablebackupCliente);
    await connection.query(createTablebackupAgendamento);
    await connection.query(createTablebackupPet);
    await connection.query(createTablebackupEndereco);
    await connection.query(createTablebackupProduto);
    await connection.query(createTablebackupPedido);

    await connection.query(createTriggerCliente);
    await connection.query(createTriggerServico);
    await connection.query(createTriggerPet);
    await connection.query(createTriggerAgendamento);
    await connection.query(createTriggerEndereco);
    await connection.query(createTriggerProduto);
    await connection.query(createTriggerPedido);

    console.log("Trigger criado com sucesso");
  } catch (error) {
    console.error("Erro ao criar trigger:", error);
  }
}

module.exports = createTrigger;
