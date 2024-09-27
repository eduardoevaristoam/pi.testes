import React, {useState} from 'react';
import './Modal.css';

function PlaylistModal({ isOpen, onClose }) {

  const [playlistName, setPlaylistName] = useState('');
  const [playlistIntervalo, setPlaylistIntervalo] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setMediaFiles(selectedFiles);
  }

  function verInput (playlistName, playlistIntervalo) {
    if(playlistName ==='' || playlistIntervalo === ''){
      return true;
    }
    else{
      return false;
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault();// evita regarregamento da pag
    
    setLoading(true);
    setError(null);

    try{
      const response = await fetch('http://localhost:4000/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: playlistName, intervalo: playlistIntervalo})
      });
     
      const data = await response.json();
      if(response.ok){
        console.log('Playlist cadastrado com sucesso', data);

        const formData = new FormData();
        mediaFiles.forEach((media) => {
          formData.append("media", media.file);
        });

        const mediaResponse = await fetch(`http://127.0.0.1:4000/playlists/${data.id}/media`, {
          method: "POST",
          body: formData,
        });

        const mediaData = await mediaResponse.json();
        if (mediaResponse.ok) {
          console.log('pl + midia cadastrado com sucesso:', mediaData);
          setPlaylistName('');
          setPlaylistIntervalo('');
          setMediaFiles([]);
          URL.revokeObjectURL();
          onClose();
          window.location.reload(); //mudar para algo que só atualize os cadastrados
        }
        else{
          console.error('Erro ao cadastrar pl + midias:', mediaData.message);
        }
      }
      else{
        console.log("erro ao cadastrar a playlist");
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
              disabled={verInput(playlistName,playlistIntervalo)}
              type="file" 
              name="playlistMedia" 
              multiple
              onChange={handleFileChange}//captura os arquivos ao serem selecionados 
            />
          </label>
          {/* exibindo as minituras das midias */}
          {mediaFiles.length > 0 && (
            <div className="media-preview-container">
              <h4>Mídias selecionadas:</h4>
              <div className="media-thumbnails">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="media-item">
                    {media.file.type.startsWith('image') ? (
                      <img src={media.preview} alt={media.file.name} className="thumbnail" />
                    ) : media.file.type.startsWith('video') ? (
                      <video src={media.preview} controls className="thumbnail" />
                    ) : (
                      <p>Arquivo nao suportado : {media.file.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )} 
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
