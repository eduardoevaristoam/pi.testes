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
import loginRouter from "./routes/loginRouter";

//Atribuindo express à variável app
const app = express();

//Middleware para habilitar CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//Middleware para popular cookies
app.use(cookieParser());

//Middleware pra obter body/json
app.use(express.json());

//Middleware pra definir sub-apps pras rotas
app.use("/media", mediaRouter);
app.use("/playlists", playlistRouter);
app.use("/devices", deviceRouter);
app.use("/login", loginRouter);

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
