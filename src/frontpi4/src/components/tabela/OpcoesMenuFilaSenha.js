import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../modal/Modal.css";

function OpcoesMenuFilaSenha({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-buttons">
          <button
            type="button"
            onClick={() => window.open("/fila-senha/apresentacao", "_blank")}
            disabled={loading}
          >
            Apresentação de senhas
          </button>

          <button
            type="button"
            onClick={() => window.open("/fila-senha/controle", "_blank")}
            disabled={loading}
          >
            Controle
          </button>

          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>

        {loading && <div>Carregando...</div>}
        {message && <div style={{ color: "green" }}>{message}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
}

export default OpcoesMenuFilaSenha;
