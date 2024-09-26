import React, {useRef, useState} from 'react';
import './Modal.css';

function DeviceModal({ isOpen, onClose }) {
  
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;
  
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita que a página seja recarregada

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: deviceName }), // Envia o nome do dispositivo
      });


      const data = await response.json();
      if (response.ok) {
        console.log('Dispositivo cadastrado com sucesso:', data);
        setDeviceName('');
        onClose();
        window.location.reload(); //mudar para algo que só atualize os cadastrados
      } else {
        console.error('Erro ao cadastrar dispositivo:', data.message);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="modal" >
      <div className="modal-content">
        <h3>Cadastrar Dispositivo</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nome do Dispositivo:
            <input 
              placeholder="Insira nome do dispositivo" 
              type="text" 
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              required 
            />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={loading}>Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeviceModal
