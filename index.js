//Estou dizendo para ele criar uma variavel que requisita o expres e declaro uma variavel app que chama a função do express
const express = require('express')
const app = express()
const session = require("express-session")
//Estou configurando o bodyParser que é o que tras os dadso inseridos no formulario
const bodyParser = require("body-parser")
//Exportando conexão
const connection = require('./DataBases/databases')
const Produto = require("./DataBases/Produto")
const produtoController = require("./Produtos/produtoController")
const Enderecamento = require("./DataBases/Enderecamento")
const enderecamentoController = require("./Enderecamento/enderecamentoController")
const Tabela = require("./DataBases/Tabela")
const tabelaController = require("./Tabelas/tabelaController")
const User = require("./DataBases/User")
const userController = require("./user/userController")
//exportando model de ciração de tabelos no banco

const PORT = process.env.PORT || 5000

const path = require('path')



//databases
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

//session
app.use(session({
    secret: "sdfsdfsdfgdfgfgh",
    cookie: { maxAge: 1800000000 }
}))
//usar o EJS como view engine | renderizador de html
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//Carregamento de arquivos estaticos no express
app.use(express.static(path.join(__dirname, 'public')))
//Carregamento do bodyPerser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//rotas
app.use("/", produtoController)
app.use("/", enderecamentoController)
app.use("/", tabelaController)
app.use("/", userController)

app.get("/", (req, res) => { res.render("index") })

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.listen(PORT, () => {
    console.log("Servidor rodando!")
})