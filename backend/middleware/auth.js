// Init: 22/12/24
// Update: 26/02/25 
// Objective: Este middleware atua como um guardião de autenticação que protege rotas privadas da aplicação, verificando a validade de tokens JWT em cada requisição.
// O middleware é responsável por extrair o token do cabeçalho da requisição, verificar a validade do token e, em caso de sucesso, adicionar o id do usuário ao objeto de requisição.
// O id do usuário é extraído do payload do token JWT decodificado e adicionado ao objeto de requisição para que as rotas protegidas possam acessar o id do usuário autenticado.
// O middleware é exportado como um módulo para ser utilizado em rotas privadas da aplicação.   
            
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Não autorizado' });
    }
};
