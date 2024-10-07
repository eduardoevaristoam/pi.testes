//Importando Express
import express from "express";
//Importando CORS
import cors from "cors";
//Importando cookie-parser
import cookieParser from "cookie-parser";

//Importando router de midia
import mediaRouter from "./routes/mediaRouter";
import playlistRouter from "./routes/playlistRouter";
import deviceRouter from "./routes/deviceRouter";

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
export default app;
