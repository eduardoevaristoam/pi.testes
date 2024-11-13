//Não implementada totalmente. Não usar ainda
//const database = require("./../database");
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
const adminUsername = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;

//Handler para logar usuario
async function loginUser(req: Request, res: Response): Promise<any> {
  //Desestruturando username e password do body
  const { username, password } = req.body;
  console.log(username, password);

  //Se algo falta, retorna (por isso em outro middleware)
  if (!username || !password)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, insira as credenciais." }); //Falta

  try {
    if (username !== adminUsername) throw new Error("Usuário inválido");
    if (password !== adminPassword) throw new Error("Senha inválida");

    //Caso haja usuario e senha esteja correta, usuario eh logado (token jwt eh criado e enviado ao client)
    res
      .status(200)
      //Setando cookie 'accessToken' com maxAge de 1 mes - Falta a key
      .cookie(
        "accessToken",
        jwt.sign(
          new Date().toLocaleString("PT-BR"),
          process.env.JWT_SECRET_KEY!
        ),
        {
          maxAge: 2592000000,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        }
      )
      .json({ status: "success", message: "Usuario logado." });
  } catch (err) {
    //Erros internos
    if (err instanceof Error) {
      res.status(500).json({ status: "error", message: err.message });
    } else {
      res.status(500).json({ status: "error", message: "Algo deu errado!" });
    }
  }
}

//
async function isUserLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  //Recuperando accessToken que deve vir como cookie do client
  const accessToken = req.cookies?.accessToken;
  //Se cookie nao estiver presente, retorne
  if (!accessToken)
    return res
      .status(401)
      .json({ status: "error", message: "Usuário não autenticado." });

  //Verificando payload do acessToken
  try {
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!);
    console.log(payload);
    res
      .status(200)
      .json({ status: "success", message: "Usuário está logado." });
  } catch (err) {
    res.status(400).json({ status: "fail", message: "Falha na autenticação" });
  }
}

async function logOut(req: Request, res: Response): Promise<any> {
  try {
    //Recuperando accessToken que deve vir como cookie do client
    const accessToken = req.cookies?.accessToken;
    //Se cookie nao estiver presente, retorne
    if (!accessToken)
      return res
        .status(401)
        .json({ status: "error", message: "Usuário não autenticado." });
    res
      .status(200)
      .clearCookie("accessToken")
      .json({ status: "success", message: "Usuário deslogado." });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ status: "error", message: err.message });
    } else {
      res.status(500).json({ status: "error", message: "Algo deu errado." });
    }
  }
}

export default { loginUser, isUserLoggedIn, logOut };
