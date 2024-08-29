//Importando Express
const express = require("express");
//Importando conexão com o POSTGRESQL
const database = require("./database");
//Importando CORS
const cors = require("cors");
//Importando Multer
const multer = require("multer");

//Importando router de midia
const mediaRouter = require("./routes/mediaRouter");

//Atribuindo express à variável app
const app = express();

//Middleware pra obter body/json
app.use(express.json());

//Middleware para habilitar CORS
app.use(cors());

//Middleware pra definir sub-apps pras rotas
app.use("/media", mediaRouter);

//Conexão com o banco de dados
database.connect();

//Exportando app para ser usado em server.js
module.exports = app;
