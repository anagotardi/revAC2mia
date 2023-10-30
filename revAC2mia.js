//criar uma branch de teste --> git branch teste
//entrar na branch de teste --> git checkout teste
//npm init -y --> no gitbash 
//npm i express nodemon body-parser mongoose --> no vscode 
//criar uma pasta chamada .gitignore e escrever node_modules para ignorá-lo 
//na pasta package json escrever após "test": "start": "nodemon ./revac2mia.js localhost:3000"
//no final do programa, passar tudo da branch de teste para a branch main --> git checkout main ;;;; git merge teste ;;;; git push origin main

//CÓDIGO ESPECÍFICO PARA A PROVA DE BANCO DE DADOS: 

//inicializar o mongodb --> net start mongo db
//no mongodb atlas e usar o comando que lista os bancos de dados --> show dbs

//CRIAR CÓDIGO COM AS SEGUINTES ESPECIFICAÇÕES: criar conexão com banco de dados; crial model solicitada; validar no mongodb; criar a rota; criar a rota/cadastro; testar o cadastro no postman conforme sua model 

//instalando programas
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");


//configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;


//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/revac2mia',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 20000
});


//criando a model do seu projeto
const PessoaSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String, required : true},
    endereco : { type : String},
    numero : {type : Number},
    cep : {type : String, required : true},
    nascimento : {type : Date, required : true}
});


const Pessoa = mongoose.model("Pessoa", PessoaSchema);


//configurando os roteamentos
app.post("/cadastropessoa", async(req, res)=>{
    const nome = req.body.nome;
    const email = req.body.email;
    const endereco = req.body.endereco;
    const numero = req.body.numero;
    const cep  = req.body.cep;
    const nascimento = req.body.nascimento


    const pessoa = new Pessoa({
        nome : nome,
        email : email,
        endereco : endereco,
        numero : numero,
        cep : cep,
        nascimento : nascimento
    })


    try{
        const newPessoa = await pessoa.save();
        res.json({error : null, msg : "Cadastro ok", pessoaId : newPessoa._id});
    } catch(error){
        res.status(400).json({error});
    }


});


app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})


//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})

