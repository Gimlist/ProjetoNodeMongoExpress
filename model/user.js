//Arquivo Model de usuário

//mongoose é usado para fazer a modelagem do BD no node.js
const mongoose = require('mongoose');
//Modelo do mongoose
const Schema = mongoose.Schema;
// biblioteca para criptografia
const bcrypt = require('bcrypt');

//Schema de usuário
const UserSchema = new Schema({
    // E-mail do usuário: tipo string, campo obrigatório, unico, e todo em caixa baixa
    email: { type: String, required: true, unique: true, lowercase: true },
    //Senha do usuário, tipo string, campo obrigatório, e não retornado na busca
    password: { type: String, required: true, select: false },
    //Campo usado para marcar data e a hora da criação do usuário
    created: { type: Date, default: Date.now }
});

//Função usada para ser chamada antes de salvar o usuário, nesse caso não é usado o arrow function por causa do uso do this
UserSchema.pre('save', async function (next) {
    //caso o usuário não seja modificado, ele segue para o próximo
    let user = this;
    //se não houver modificação no campo de senha, ele segue para o próximo
    if (!user.isModified('password')) return next();

    //função para criptografar senha, com 10 processos de encriptação
    user.password = bcrypt.hash(user.password, 10);
    //segue para o próximo
    return next();
});

//Exportação do Usuário
module.exports = mongoose.model('User', UserSchema);
