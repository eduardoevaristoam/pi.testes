//Configurando variáveis de enviroment
import dotenv from "dotenv";
dotenv.config();

//Importando middlewares, etc do Express
import app from "./app";

//Definindo port do servidor
const port = process.env.PORT || 4000;

//Iniciando servidor
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
