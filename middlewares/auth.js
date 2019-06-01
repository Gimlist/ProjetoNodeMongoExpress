//instaciando o JsonWebToken
const jwt = require('jsonwebtoken');
//arquivo de configuração
const config = require('../config/config');

// Verifica o token do usuário para liberação do acesso
const auth = (req, res, next) => {
    // variável local recebe a autenticação do header do objeto
    const tokenHeader = req.headers.auth;
    // Token header enviado inválido
    if(!tokenHeader) return res.status(401).send({error: 'Token não enviado!'})

    //Verifica se o token enviado é válido ou não
    jwt.verify(tokenHeader, config.jwt_pass,(err, decoded) =>{
        //caso não seja válido, retorna a mensagem de erro
        if(err) return res.status(401).send({error: 'Token Inválido!'});

        //guarda o id do usuário decodificado na locals do express
        res.locals.authData = decoded;

        //caso seja válido, retorna para o próximo passo   
        return next();
    });
}

//Módulo de exportação
module.exports = auth;