//Não implementada totalmente. Não usar ainda
const database = require("./../database");
const jwt = require("jsonwebtoken");

//Handler para logar usuario
exports.loginUser = async (req, res) => {
  //Desestruturando username e password do body
  const { username, password } = req.body;
  console.log(username, password);

  //Se algo falta, retorna (por isso em outro middleware)
  if (!username || !password)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, insira as credenciais." }); //Falta

  try {
    //Checando se credenciais estao corretas - essa tabela nao existe*****
    const query = await database.query(
      "SELECT id FROM usuarios WHERE username = $1 AND password = $2",
      [username, password]
    );
    const userId = query.rows;
    console.log(query.rows);

    //Se nenhum usuario for encontrado com tais credenciais
    if (!userId)
      return res
        .status(400)
        .json({ status: "fail", message: "Credenciais invalidas" });

    //Caso haja usuario e senha esteja correta, usuario eh logado (token jwt eh criado e enviado ao client)
    res
      .status(200)
      //Setando cookie 'accessToken' com maxAge de 1 mes - Falta a key
      .cookie("accessToken", jwt.sign(userId, process.env.JWT_SECRET_KEY), {
        maxAge: 2592000000,
      })
      .json({ status: "success", message: "Usuario logado." });
  } catch (err) {
    //Erros internos
    res.status(500).json({ status: "error", message: "Algo deu errado." });
  }
};

exports.isUserLoggedIn = (req, res, next) => {
  //Recuperando accessToken que deve vir como cookie do client
  const accessToken = req.cookies?.accessToken;
  //Se cookie nao estiver presente, retorne
  if (!accessToken) return;

  //Verificando payload do acessToken
  const userId = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
  console.log(userId);
};
