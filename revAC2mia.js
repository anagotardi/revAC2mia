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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const port= 3000; 

//configurando o acesso ao mongodb 

mongoose.connect('mongodb://127.0.0.1:27017/revAC2MIA',  //inserir nome do banco de dados próprio inves do revac2mia
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//criando a model do seu projeto 

const PessoaSchema = new mongoose.Schema({ //caso esteja escrito 'obrigatório' no documento, escrever 'required' "
    nome : {type : String}, 
    email : {type : String, require : true}, 
    endereco :  {type : String},
    numero : {type : Number},
    cep : {type : String, require : true},
    nascimento : {type : Date, require : true}
});

const Pessoa = mongoose.model("Pessoa", PessoaSchema);

//configurando os roteamentos 

app.post("/cadastropessoa", async(req, res)=>{
    const nome = req.body.nome; 
    const email =  req.body.email;
    const endereco = req.body.endereco;
    const numero = req.body.numero;
    const cep = req.body.cep;
    const nascimento = req.body.nascimento 

    //testando se todos os campos foram preenchidos
    if(nome == null || email == null || endereco == null || numero == null || cep == null || nascimento == null){
        return res.status(400).json({error: "Preencher todos os campos"});
    }

    //TESTE MAIS IMPORANTE DA AC!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const emailExiste = await Pessoa.findOne({email:email});

    if(emailExiste){
        return res.status(400).json({error: "O email cadastrado já existe!!!"})
    }

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
    } 
    
    catch(error){
        res.status(400).json({error}); 
    }
}); 

//rota para o get de cadastro
app.get("/cadastropessoa.html", async(req, res)=>{
    res.sendFile(__dirname +"/cadastropessoa.html")
});

//rota raiz - INW // a rota raiz é sempre a última rota

app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html")
});

//configurando a porta 

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})

/*testando no postman
1: GET --> localhost:3000
2: POST -->localhost:3000/cadastropessoa --> body --> raw --> json
3: inserir os dados em json
EXEMPLO:
{
    "nome": "Epaminondas o Grande",
    "email": "epa@gmail",
    "endereco": "Rua Sei La",
    "numero": 198,
    "cep": "01111-000",
    "nascimento": "10-31-2023"
}

4: verificar se os dados foram inseridos no mongodb

*/
