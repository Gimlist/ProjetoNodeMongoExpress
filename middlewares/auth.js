//instaciando o JsonWebToken
const jwt = require('jsonwebtoken');

// Verifica o token do usuário para liberação do acesso
const auth = (req, res, next) => {
    // variável local recebe a autenticação do header do objeto
    const tokenHeader = req.headers.auth;
    // Token header enviado inválido
    if(!tokenHeader) return res.send({error: 'Token não enviado!'})

    //Verifica se o token enviado é válido ou não
    jwt.verify(tokenHeader, 'senhadowebt0ken',(err, decoded) =>{
        //caso não seja válido, retorna a mensagem de erro
        if(err) return res.send({error: 'Token Inválido!'});

        //guarda o id do usuário decodificado na locals do express
        res.locals.authData = decoded;

        //caso seja válido, retorna para o próximo passo   
        return next();
    });
}

//Módulo de exportação
module.exports = auth;