function errorHandler(err, req, res, next) {
    const timestamp = new Date();

    //erro de validação
    if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json(
            {
                error: "Um erro aconteceu. Já existe um registro com esse valor.",
                rota: req.path,
                método: req.method,
                dataHora: timestamp
            });

        //erro database
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(400).json(
            {
                error: "Um erro aconteceu. O registro solicitado, não existe na tabela de referência.",
                rota: req.path,
                método: req.method,
                dataHora: timestamp
            });

    } else if (err.name === 'SequelizeTimeoutError') {
        res.status(400).json(
            {
                error: "Um erro aconteceu. Tempo esgotado aguardando uma requisição.",
                rota: req.path,
                método: req.method,
                dataHora: timestamp
            });

    } else if (err.name === 'SequelizeExclusionConstraintError') {
        res.status(400).json(
            {
                error: "Ocorreu um erro na exclusão de um item no banco de dados.",
                rota: req.path,
                método: req.method,
                dataHora: timestamp
            });

    } else if (err.name === 'SequelizeUnknownConstraintError') {
        res.status(400).json(
            {
                error: "Ocorreu um erro ao encontrar o nome da restrição no banco de dados.",
                rota: req.path,
                método: req.method,
                dataHora: timestamp
            });

        //erro de conecção 
    } else if (err.name === 'SequelizeHostNotFoundError') {
        res.status(400).json(
            {
                error: "Ocorreu um erro ao tentar encontrar o servidor.",
                rota: req.path,
                método: req.method,
                dataHora: timestamp
            });

    } else if (err.name === 'SequelizeInvalidConnectionError') {
        res.status(400).json({
            error: "Ocorreu um erro ao tentar estabelecer uma conexão.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });

    } else if (err.name === 'SequelizeConnectionTimedOutError') {
        res.status(400).json({
            error: "Ocorreu um erro. O tempo de conexão se esgotou.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });

        } else if (err.name === 'SequelizeAccessDeniedError') {
        res.status(400).json({
            error: "Ocorreu um erro. O acesso foi negado",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });

    } else if (err.name === 'SequelizeConnectionAcquireTimeoutError') {
        res.status(400).json({
            error: "Erro lançado quando a conexão não é adquirida devido ao tempo limite.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });

    } else if (err.name === 'SequelizeConnectionRefusedError') {
        res.status(400).json({
            error: "Erro lançado quando uma conexão com um banco de dados é recusada.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });

        //erros
    } else if (err.name === 'SequelizeConnectionError') {
        res.status(400).json({
            error: "Ocorreu um erro de conexão.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });
    
    } else if (err.name === 'SequelizeOperationTimedOutError') {
        res.status(400).json({
            error: "Ocorreu um erro. O tempo na operação se esgotou.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });

    } else if (err.name === 'SequelizeValidationError') {
        res.status(400).json({
            error: "Ocorreu um erro na tentativa de validar uma sequência.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });

    } else if (err.name === 'SequelizeScopeError') {
        res.status(400).json({
            error: "Ocorreu um erro quando o sequelize não pode consultar o escopo especificado.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });

    } else if (err.name === 'SequelizeEmptyResultError') {
        res.status(400).json({
            error: "Ocorreu um erro. O registro não foi encontrado.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });

    } else if (err.name === 'SequelizeDatabaseError') {
        res.status(400).json({
            error: "Ocorreu um erro no banco de dados.",
            rota: req.path,
            método: req.method,
            dataHora: timestamp
        });
    }} 

    module.exports = errorHandler