import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../App.css';
import Modal from '../modal/Modal.css';

function SectionLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Exemplo de verificação simples
    if (username === 'admin' && password === 'admin') {
      navigate('/central-de-comando'); // Redireciona após login
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
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
