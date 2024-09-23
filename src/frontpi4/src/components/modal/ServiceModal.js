/*esse arquivo js é apenas pra fazer um teste e simular a funcionalidade
dos serviços atribuidos ao dispositivo (que estão definidos pra testar)
por meio de um modal,
ele faz a leitura do serviço e apresenta um modal com checkbox na frente do nome,
se o serviço ou playlist ja estiver atribuido a ele, entao aparece a checkbox marcada,
se não, entao aparece checkbox vazia.
obs: criei pra testar mas nao faço ideia como implementar de forma funcional,
deixei o script só pra evitar de esquecer da ideia
*/
import React, { useState, useEffect } from 'react';
import './Modal.css'; // Estilos do modal

export default function ServiceModal({ isOpen, onClose }) {
  const [devices, setDevices] = useState([]); // lista de dispositivos
  const [selectedDevices, setSelectedDevices] = useState([]); // dispositivos com o serviço atribuído

  // Simulação da busca dos dispositivos e atribuições
  useEffect(() => {
    if (isOpen) {
      const fetchedDevices = [
        { id: 1, name: 'Dispositivo 1', hasService: true },
        { id: 2, name: 'Dispositivo 2', hasService: false },
        { id: 3, name: 'Dispositivo 3', hasService: true }
      ];
      setDevices(fetchedDevices);
      setSelectedDevices(fetchedDevices.filter(device => device.hasService).map(device => device.id));
    }
  }, [isOpen]);

  const toggleDeviceSelection = (deviceId) => {
    setSelectedDevices(prevSelectedDevices =>
      prevSelectedDevices.includes(deviceId)
        ? prevSelectedDevices.filter(id => id !== deviceId) // desmarcar
        : [...prevSelectedDevices, deviceId] // marcar
    );
  };

  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  const handleConclude = () => {
    // lógica para salvar as alterações (ex.: chamada ao back-end)
    onClose(); // fechar o modal
  };

  return isOpen ? (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content">
        <h3>Dispositivos disponíveis</h3>
        <ul>
          {devices.map(device => (
            <li key={device.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedDevices.includes(device.id)}
                  onChange={() => toggleDeviceSelection(device.id)}
                />
                {device.name}
              </label>
            </li>
          ))}
        </ul>
        <div className="modal-buttons">
          <button onClick={handleConclude}>Concluir</button>
        </div>
      </div>
    </div>
  ) : null;
}
