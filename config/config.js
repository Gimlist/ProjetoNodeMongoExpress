// Arquivo de configuração do projeto

const env = process.env.NODE_ENV || 'dev';

const config = () => {
    switch (env) {
        case 'dev':
            return {
                db_string :'mongodb+srv://usuario_admin:<senhabanco>@urlbanco',
                jwt_pass: 'senhadowebt0ken',
                jwt_expires_in: '7d' 
            }
        case 'hml':
            return {
                db_string :'mongodb+srv://usuario_admin:<senhabanco>@urlbanco',
                jwt_pass: 'senhadowebt0kenHml',
                jwt_expires_in: '7d' 
            }
        case 'prod':
            return {
                db_string :'mongodb+srv://usuario_admin:<senhabanco>@urlbanco',
                jwt_pass: 'AhpTrpj7KvzzHYM3T9tQH3HEhQxyvqNHXtNVrLFNUcuFtnPkQs',
                jwt_expires_in: '7d' 
            }
    }
}

// retorna o ambiente que a API está rodando
console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`)


module.exports = config();
