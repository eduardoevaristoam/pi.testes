import React from 'react';
import './Header.css';
import userIcon from '../assets/UserIcon.png';

function Header() {
  return (
    <header className="header">
      <h1>Central de Comando</h1>
      <img src={userIcon} alt="Ícone do usuário" className="user-icon" />
    </header>
  );
}

export default Header;
