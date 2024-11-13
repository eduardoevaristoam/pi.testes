import React from "react";
import "./Header.css";
import userIcon from "../assets/UserIcon.png";
import { useLogin } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { setIsLogged } = useLogin();
  const navigate = useNavigate();

  async function handleLogOut() {
    try {
      const res = await fetch("https://api-p-i-4.onrender.com/login/logout", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data?.status !== "success") throw new Error(data.message);
      setIsLogged(false);
      navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <header className="header">
      <h1>Central de Comando</h1>
      <img src={userIcon} alt="Ícone do usuário" className="user-icon" />
      <button onClick={handleLogOut}>Deslogar</button>
    </header>
  );
}

export default Header;
