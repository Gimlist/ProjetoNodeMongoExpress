//Aqui se trabalha as requisições feitas na raiz do projeto

//instanciando o express no index
const express = require('express');
//instaciando a rota
const router = express.Router();

//instanciando arquivo de autenticação
const auth = require('../middlewares/auth');

//endpoint GET da raiz, acessado somente para usuário autenticado com o token
router.get('/', auth, (req, res) =>{
    //retorno do objeto com  id do usuário decodificado do token na pasta locals do express
    return res.send(res.locals.authData)
});

//endpoint POST da raiz
router.post('/', (req, res) =>{
    //retorno do objeto com propriedade message contendo uma mensagem
    return res.send({message:'Retorno Post raiz.'})
});

//exportando o módulo
module.exports = router;