//Importando Express
const express = require("express");
//Importando conexão com o POSTGRESQL
const database = require("./database");
//Importando CORS
const cors = require("cors");
//Importando Multer - Acho que nao precisa estar aqui
const multer = require("multer");
//Importando cookie-parser
const cookieParser = require("cookie-parser");

//Importando router de midia
const mediaRouter = require("./routes/mediaRouter");
const playlistRouter = require("./routes/playlistRouter");
const deviceRouter = require("./routes/deviceRouter");

//Atribuindo express à variável app
const app = express();

//Middleware para popular cookies
app.use(cookieParser());

//Middleware pra obter body/json
app.use(express.json());

//Middleware para habilitar CORS
app.use(cors());

//Middleware pra definir sub-apps pras rotas
app.use("/media", mediaRouter);
app.use("/playlists", playlistRouter);
app.use("/devices", deviceRouter);

//Falta implementar totalmente
//app.post("/login", loginUser);

//Conexão com o banco de dados
/*
database.connect((err) => {
  if (err) return;
  console.log("conectado.");
});
*/

//Exportando app para ser usado em server.js
module.exports = app;