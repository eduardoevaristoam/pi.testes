//Configurando variáveis de enviroment
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//Importando middlewares, etc do Express
const app = require("./app");

//Definindo port do servidor
const port = process.env.PORT;

//Iniciando servidor
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
