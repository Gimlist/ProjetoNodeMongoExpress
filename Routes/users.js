//Aqui se trabalha as requisições referentes à usuários do projeto

//instanciando o express no index
const express = require('express');
//instaciando a rota
const router = express.Router();
// Model de usuários
const Users = require('../model/user');
//bcrypt usado para trabalhar com criptografia do campo senha
const bcrypt = require('bcrypt');
//JsonWebToken usado para criar tokens para autenticação de clientes
const jwt = require('jsonwebtoken');
//arquivo de configuração
const config = require('../config/config');

//Função para criar tokens a usuários
const createUserToken = (userId) => {
    // retorna o token quer foi gerado com o id de usuário + senha, e a expiração em 7 dias
    return jwt.sign({id: userId}, config.jwt_pass, {expiresIn: config.expiresIn})
}

//endpoint GET de usuários de forma assíncrona
router.get('/', async (req, res) => {
    //tratamento de erros
    try {
        // Busca os usuários aguardando o retorno da busca dos usuários
        const users = await Users.find({});
        //retorna o objeto com a lista de usuários
        return res.send(users);
    }
    catch (err) {
        //retorna erro
        return res.status(500).send({ error: 'Erro na consulta de usuários!' });
    }
});

//endpoint POST de usuários
router.post('/', (req, res) => {
    //retorno do objeto com propriedade message contendo uma mensagem
    return res.send({ message: 'Retorno Post da rota de usuários.' })
})

//rota de criação de usuários
router.post('/create', async (req, res) => {
    console.log(req.body);
    //desestruturamento do objeto req.body, e atribuindo às variaveis constantes e-mail e senha
    const { email, password } = req.body;
    //verifica se tem os dados(e-mail, senha) para criação de usuário
    if (!email || !password) return res.status(400).send({ error: `Dados insuficientes!Email: ${email}, Password: ${password}) ` });

    try {
        //se ele retornar algum objeto, já existe um usuário com e-mail
        if (await Users.findOne({ email })) return res.status(400).send({ error: 'Usuário já registrado' });

        //Caso passe nas validações acima, ele cria um novo usuário
        const user = await Users.create(req.body);
        //antes de retornar o usuário criado, o campo senha é deixado como indefinido
        user.password = undefined;

        // retorna o objeto do novo usuário + token de acesso
        return res.status(201).send({user, token: createUserToken(user.id)});

    } catch (err) {
        // caso orreu um erro ao tentar buscar usuário
        return res.status(500).send({ erro: 'Erro ao buscar usuário' });
    }
});

//POST de autenticação  de usuários
router.post('/auth', async (req, res) => {
    //desestruturamento do objeto req.body, e atribuindo às variaveis constantes e-mail e senha
    const { email, password } = req.body;

    //verifica se tem os dados(e-mail, senha) necessários para autenticação de usuário
    if (!email || !password) return res.status(400).send({ error: 'Dados insuficientes!' });

    try {
        //busca o usuário de acordo com o e-mail passado, com o select no final para forçar o retorno da senha
        const user = await Users.findOne({ email }).select('+password');

        //caso não ache o usuário a partir do e-mail passado
        if (!user) return res.status(400).send({ error: 'Usuario não registrado!' });

        //bcrypt faz a comparação da senha enviada com a senha criptografada do BD
        const passOk = await bcrypt.compare(password, user.password);

        //retorna booleano para verificar se as senhas são iguais, caso não seja, retorna o erro de autenticação
        if (!passOk) return res.status(401).send({ error: 'Erro ao autenticar usuário!' });

        //senha sendo indefinida para retorno
        user.password = undefined;
        // retorna o objeto do novo usuário + token de acesso
        return res.send({user, token: createUserToken(user.id)});
    } catch (err) {
        //Caso haja erro na busca de usuário
        return res.status(500).send({ error: 'Erro ao buscar usuário!' });
    }

});

//exportando o módulo
module.exports = router;


/*
Códigos de Retorno:
200 - OK
201 - CREATED
202 - ACCEPTED

400 - BAD REQUEST
401 - UNAUTHORIZED -- AUTENTICAÇÃO, TEM CARATER TEMPORÁRIO
403 - FORBIDDEN -- AUTORIZAÇÃO, TEM CARÁTER PERMANENTE
404 - NOT FOUND

500 - INTERNAL SERVER ERROR
501 - NOT IMPLEMENTED  -- A API NÃO SUPORTA ESSA FUNCIONALIDADE  
503 - SERVICE UNAVAIABLE -- A API EXECUTA ESSA OPERAÇÃO, MAS NO MOMENTO ESTÁ INDISPONÍVEL
*/