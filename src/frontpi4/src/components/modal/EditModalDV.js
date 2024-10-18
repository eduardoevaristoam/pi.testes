import React, {useRef, useState, useEffect} from 'react';
import './Modal.css';

function EditModalDV({ Id, isOpen, onClose }) {
  
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playlistName, setPlaylistName] = useState('');

  const buscaDadosById = async (Id) => {
    try{
      const response = await fetch(`http://localhost:4000/devices/${Id}`);
      const data = await response.json();
      const response1 = await fetch(`http://localhost:4000/playlists/${data.data.idPlaylist}`);
      const data1 = await response1.json();
      setDeviceName(data.data.nome);
      if(data.data.idPlaylist !== null ){
        setPlaylistName(data1.data.nome);
      }
      else{
        setPlaylistName("Nenhuma atribuição.");
      }
    }
    catch (error){
      console.error('Erro ao verificar nome do dispositivo:', error);
    }
  };

  useEffect(() => {
    if (isOpen && Id) {
      buscaDadosById(Id); // Chama a função de busca ao abrir o modal
    }
  }, [isOpen, Id]);

  const checkDeviceNameExist = async (deviceName) => {
    try{
      const response = await fetch(`http://localhost:4000/devices`);
      const data = await response.json();
      for(let i = 0; i < data.data.length; i++){
        if(data.data[i].nome === deviceName){
          return true;
        }
      }
    }
    catch (error){
      console.error('Erro ao verificar nome do dispositivo:', error);
      return false;
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita que a página seja recarregada

    setLoading(true);
    setError(null);

    const nameExists = await checkDeviceNameExist(deviceName);
    if(nameExists){
      alert('dispositivo ja cadastrada com este nome.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/devices/${Id}`, {
        method: 'PATCH',
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
        <h3>Editar Dispositivo Cadastrado</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nome do Dispositivo:
            <input 
              type="text" 
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              required 
            />
          </label>
          <label>
            Playlist atribuida:
            <input 
              value={playlistName}
              disabled
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

export default EditModalDV
