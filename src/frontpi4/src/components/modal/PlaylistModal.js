import React, {useState} from 'react';
import styles from './Modal.css';

function PlaylistModal({ isOpen, onClose }) {

  const [playlistName, setPlaylistName] = useState('');
  const [playlistIntervalo, setPlaylistIntervalo] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    setMediaFiles(event.target.files);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();// evita regarregamento da pag
    
    setLoading(true);
    setError(null);

    try{

      const formData = new FormData();
      formData.append('nome', playlistName);
      formData.append('intervalo', playlistIntervalo);

      for(let i = 0; i < mediaFiles.length; i++){
        formData.append('playlistMedia', mediaFiles[i]);
      }

      const response = await fetch('http://localhost:4000/playlists', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if(response.ok){
        console.log('Playlist cadastrado com sucesso', data);
        setPlaylistName('');
        setPlaylistIntervalo('');
        setMediaFiles([]);
        onClose();
        //window.location.reload(); testar e verificar aqui!
      }
      else{
        console.error('Erro ao cadastrar playlist:', data.message);
      }
    }
    catch(error){
      console.error('Erro na requisicao:', error);
    }
    finally{
      setLoading(false);
    }

  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Criar Playlist</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nome da Playlist:
            <input
              placeholder="Insira nome da playlist"
              type="text" 
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              required
            />
          </label>
          <label>
            Tempo de exibição (segundos):
            <input 
              placeholder="Informe o tempo em segundos"
              type="number" 
              min="1" 
              step="1"
              value={playlistIntervalo}
              onChange={(e) => setPlaylistIntervalo(e.target.value)}
            />
          </label>
          <label>
            Adicionar mídia:
            <input 
              type="file" 
              name="playlistMedia" 
              multiple
              onChange={handleFileChange}//captura os arquivos ao serem selecionados 
            />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaylistModal;
