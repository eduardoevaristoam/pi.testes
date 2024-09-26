/* 
falta criar o componente que traz as informações e alimenta os <tr />
das tabelas
*/

import Tabela from './Tabela.css';
import React, { useEffect, useState} from 'react';
import OpcoesMenu from './OpcoesMenu';

function TabelaDV(){

  const [selectedDevice, setSelectedDevice] = useState(null);//controla qual dispositivo esta sendo manipulado
  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);
  const openOptionsModal = () => setOptionsModalOpen(true);
  const closeOptionsModal = () => setOptionsModalOpen(false);

  const handleButtonClick = (device) => {
    setSelectedDevice(device === selectedDevice ? null : device);
  };

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:4000/devices');
      if (!response.ok) {
        throw new Error('Erro ao buscar dispositivos');
      }
      const data = await response.json();
      setDevices(data.data); // data.data contém os dispositivos
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices(); // Chama a função para buscar dispositivos ao montar o componente
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return(
    <table className="service-table">
        <thead>
          <tr>
            <th>Nome Dispositivo</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td>{device.nome}</td>
              <td>
                <button onClick={() => handleButtonClick(device.id)}>...</button>
                {selectedDevice === device.id && ( <OpcoesMenu direction="devices" Id={device.id} name={device.name} onClose={() => setSelectedDevice(null) } />)}
              </td>
            </tr>
          ))}
          
        </tbody>
    </table>
    
  );
}

export default TabelaDV