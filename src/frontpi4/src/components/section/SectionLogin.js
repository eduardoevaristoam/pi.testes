import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../App.css";
import Modal from "../modal/Modal.css";
import { useLogin } from "../../contexts/AuthContext";
import Loader from "../assets/Loader";

function SectionLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  //Consumindo valores do context
  const { isLogged, setIsLogged, isLoading } = useLogin();
  console.log(isLogged);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // // Exemplo de verificação simples
    // if (username === 'admin' && password === 'admin') {
    //   navigate('/central-de-comando'); // Redireciona após login
    // } else {
    //   setError('Usuário ou senha incorretos');
    // }
    //Fazendo requisição p rota de login da API
    const res = await fetch("https://api-p-i-4.onrender.com/login", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ username: username, password: password }),
      credentials: "include",
    });
    const data = await res.json();
    //Se qualquer erro, mostra ele
    if (data?.status !== "success") {
      setError(data.message);
      return;
    }
    //Seta global state do context de logado para true
    setIsLogged(true);
    //Caso contrário, navegue até a central
    navigate("/central-de-comando");
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="modal">
      <div className="modal-content">
        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Usuário:
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Senha:
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Entrar</button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default SectionLogin;
