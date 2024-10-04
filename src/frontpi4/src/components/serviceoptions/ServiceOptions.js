/*
Aqui foi outra tentativa de implementação de verificação do serviço atribuido 
ao dispositivo, e exibir as checkbox... podemos desconsiderar, deixei aqui só
pra nao esquecer da ideia
*/ 

import React, { useState, useEffect } from 'react';

export default function ServiceOptions() {
  const [devices, setDevices] = useState([]); // lista de dispositivos
  const [selectedDevices, setSelectedDevices] = useState([]); // dispositivos com o serviço atribuído

  // Simulação da busca dos dispositivos e atribuições (pode ser substituído por uma chamada de API no back-end)
  useEffect(() => {
    const fetchedDevices = [
      { id: 1, name: 'Dispositivo 1', hasService: true },
      { id: 2, name: 'Dispositivo 2', hasService: false },
      { id: 3, name: 'Dispositivo 3', hasService: true }
    ];
    setDevices(fetchedDevices);
    setSelectedDevices(fetchedDevices.filter(device => device.hasService).map(device => device.id));
  }, []);

  const toggleDeviceSelection = (deviceId) => {
    setSelectedDevices(prevSelectedDevices =>
      prevSelectedDevices.includes(deviceId)
        ? prevSelectedDevices.filter(id => id !== deviceId) // desmarcar
        : [...prevSelectedDevices, deviceId] // marcar
    );
  };

  return (
    <div className="service-options">
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
    </div>
  );
}
