// declaração do express na aplicação
const express = require('express');
//instaciando o app pelo express
const app = express();
//mongoose é usado para fazer a modelagem do BD no node.js
const mongoose = require('mongoose');

//Body-Parser é usado para o codificar e decodificar o objeto Json no app
const bodyParser = require('body-parser');

//string de conexão mongodb+srv://usuario_admin:<password>@clusterapi-pwrch.mongodb.net/test?retryWrites=true
const urlDb = 'mongodb+srv://usuario_admin:<SenhaMongo>@clusterapi-pwrch.mongodb.net/test?retryWrites=true';

//Opções de Banco de dados, reconnectTries -> tentativas de reconexão, reconnectInterval -> intervalo de conexão 500 milisegundos, poolsize -> tamanho do pool, 5 por padrão, useNewUrlParser -> evita retornar mensagens de atualizações do mongoose
const options ={ reconnectTries: Number.MAX_VALUE, reconnectInterval:500, poolSize: 5, useNewUrlParser: true};

// conectando no MongoDB pelo mongoose
mongoose.connect(urlDb, options);
//evita alertas no console
mongoose.set('useCreateIndex', true);

// trata erro de conexão com o BD
mongoose.connection.on('error', (err) => { 
    console.log(`Erro na conexão com o banco de dados. Erro: ${err}`)
})

// Avisa quando o BD é desconectado
mongoose.connection.on('disconnected', ()=>{
    console.log('Aplicação desconectada do banco de dados.')
})

// Retorna sucesso na conexão com o BD
mongoose.connection.on('connected', ()=>{
    console.log('Aplicação conectada ao bando de dados!')
})

//configurações do Body-Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Acessa as rotas do index
const indexRoute = require('./Routes/index');

//Acessa as rotas de usuários
const usersRoute = require('./Routes/users');

//Definindo as rotas direto na raiz para o index
app.use('/', indexRoute);

//Definindo as rotas de usuário para o /users
app.use('/users', usersRoute);

// Porta que o app usa 
app.listen(3000);

// exportando o módulo
module.exports = app;   
