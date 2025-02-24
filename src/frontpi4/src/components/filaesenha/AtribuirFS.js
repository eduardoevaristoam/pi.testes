import React, { useEffect, useState } from "react";
import "../modal/Modal.css";

function AtribuirFS({ Id, isOpen, onClose }) {
  const [devices, setDevices] = useState([]);
  const [playlistName, setServiceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState(new Set()); // Armazena os dispositivos selecionados
  const [deselectedDevices, setDeselectedDevices] = useState(new Set());

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api-p-i-4.onrender.com/devices"); // Endpoint para buscar dispositivos
      const data = await response.json();
      if (response.ok) {
        setDevices(data.data || []); // Ajuste conforme a estrutura de sua resposta
        const preSelectedDevices = new Set(
          data.data
            .filter((device) => device.idPlaylist === Id)
            .map((device) => device.id)
        );
        setSelectedDevices(preSelectedDevices);
      } else {
        throw new Error(data.message || "Erro ao buscar dispositivos");
      }
    } catch (error) {
      setError(error.message);
      console.error("Erro ao buscar dispositivos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceName = async () => {
    setServiceName("Fila e Senha");
  };

  useEffect(() => {
    if (isOpen) {
      fetchServiceName(); // Busca nome da playlist ao abrir o modal
      fetchDevices();
    } else {
      setDevices([]); // Reseta a lista de dispositivos ao fechar o modal
      setSelectedDevices(new Set()); // Limpa os dispositivos selecionados
      setDeselectedDevices(new Set());
    }
  }, [isOpen]);

  const handleCheckboxChange = (deviceId) => {
    const updatedSelection = new Set(selectedDevices);
    const updatedDeselection = new Set(deselectedDevices);

    if (updatedSelection.has(deviceId)) {
      updatedSelection.delete(deviceId); // Desmarca o checkbox se já estiver marcado
      updatedDeselection.add(deviceId);
    } else {
      updatedSelection.add(deviceId); // Marca o checkbox
      updatedDeselection.delete(deviceId);
    }
    setSelectedDevices(updatedSelection);
    setDeselectedDevices(updatedDeselection);
  };

  const handleSubmit = async () => {
    // Converte sets em arrays
    const devicesToAdd = Array.from(selectedDevices);
    const devicesToRemove = Array.from(deselectedDevices);
    console.log({ Id });

    try {
      // Cria um array para armazenar as promessas de atualização
      const addPromises = devicesToAdd.map(async (deviceId) => {
        const response = await fetch(
          `https://api-p-i-4.onrender.com/devices/${deviceId}`,
          {
            // Ajuste o endpoint se necessário
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idPlaylist: Id }), // Envia o ID da playlist para cada dispositivo
          }
        );

        // Verifica se a resposta está ok e trata os erros
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Erro ao atualizar dispositivo ${deviceId}: ${errorData.message}`
          );
        }

        return response.json(); // Retorna a resposta em formato JSON se necessário
      });

      const removePromises = devicesToRemove.map(async (deviceId) => {
        const response = await fetch(
          `https://api-p-i-4.onrender.com/devices/${deviceId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idPlaylist: null }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Erro ao atualizar dispositivo ${deviceId}: ${errorData.message}`
          );
        }
        return response.json();
      });

      await Promise.all([...addPromises, ...removePromises]);

      console.log("Dispositivo atualizados com sucesso");
      onClose();
    } catch (error) {
      console.error("Erro na requisição de atualização:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <table className="service-table">
          <thead>
            <tr>
              <th colSpan="2" style={{ textAlign: "center" }}>
                {playlistName}
              </th>
            </tr>
            <tr>
              <th>Nome Dispositivo</th>
              <th>Atribuir</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.nome}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDevices.has(device.id)} // Marca se o dispositivo está selecionado
                    onChange={() => handleCheckboxChange(device.id)} // Chama a função ao mudar o estado do checkbox
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-buttons" style={{ marginTop: "15px" }}>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" onClick={handleSubmit}>
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default AtribuirFS;
