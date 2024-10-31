import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SectionDevice() {
  const [dispositivo, setDispositivo] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Faz uma chamada para buscar todos os dispositivos do banco de dados
      const response = await fetch(`https://api-p-i-4.onrender.com/devices`);
      const data = await response.json();

      if (data.status === "success") {
        // Verifica se existe algum dispositivo com o nome informado
        const dispositivoEncontrado = data.data.find(
          (device) => device.nome.toLowerCase() === dispositivo.toLowerCase()
        );

        if (dispositivoEncontrado) {
          // Se o dispositivo foi encontrado, redireciona para a tela de apresentação de slides
          navigate(`/apresentacao-dispositivo/${dispositivoEncontrado.id}`);
        } else {
          // Se o dispositivo não foi encontrado, exibe uma mensagem de erro
          setError("Dispositivo não encontrado");
        }
      } else {
        setError("Erro ao buscar dispositivos");
      }
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error);
      setError("Erro ao conectar-se ao servidor");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div>
          <h2>Buscar Dispositivo</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome do dispositivo"
              value={dispositivo}
              onChange={(e) => setDispositivo(e.target.value)}
            />
            <button type="submit">Buscar</button>
            {error && <p>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SectionDevice;
