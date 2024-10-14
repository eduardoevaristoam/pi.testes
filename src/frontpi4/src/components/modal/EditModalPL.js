import React, { useEffect, useState } from 'react';
import './Modal.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import BinIcon from '../assets/BinIcon.png';

function EditModalPL({ Id, isOpen, onClose }) {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistIntervalo, setPlaylistIntervalo] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscaDadosById = async (Id) => {
    try {
      const response = await fetch(`http://localhost:4000/playlists/${Id}`);
      const data = await response.json();
      setPlaylistName(data.data.nome);
      setPlaylistIntervalo(data.data.intervalo);
      buscaMidiasById(Id);
    } catch (error) {
      console.error('Erro ao buscar dados da playlist:', error);
    }
  };

  const buscaMidiasById = async (Id) => {
    try {
      const response = await fetch(`http://localhost:4000/playlists/${Id}/media`);
      const mediaData = await response.json();
      if (mediaData.status === "success") {
        setExistingMedia(mediaData.data);
      }
    } catch (error) {
      console.error('Erro ao buscar mídias da playlist', error);
    }
  };

  useEffect(() => {
    if (isOpen && Id) {
      buscaDadosById(Id);
    } else {
      setPlaylistName('');
      setPlaylistIntervalo('');
      setMediaFiles([]);
      setExistingMedia([]);
    }
  }, [isOpen, Id]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setMediaFiles(selectedFiles);
  };

  const handleMediaDelete = async (mediaId) => {
    if (window.confirm('Você tem certeza que deseja excluir esta mídia?')) {
      try {
        const response = await fetch(`http://localhost:4000/media/${mediaId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setExistingMedia(existingMedia.filter(media => media.id !== mediaId));
        } else {
          console.error('Erro ao excluir mídia:', await response.json());
        }
      } catch (error) {
        console.error('Erro na requisição de exclusão de mídia:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      mediaFiles.forEach(media => {
        formData.append('media', media.file);
      });

      const response1 = await fetch(`http://localhost:4000/playlists/${Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: playlistName, intervalo: parseInt(playlistIntervalo, 10) })
      });

      const response = await fetch(`http://localhost:4000/playlists/${Id}/media`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const data1 = await response1.json();
      if (response.ok && response1.ok) {
        console.log('Playlist atualizada com sucesso:', data);
        onClose();
        window.location.reload();
      } else {
        console.error('Erro ao atualizar playlist:', data.message);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função de reorganização no drag and drop
  const onDragEnd = (result) => {
    const { destination, source } = result;
  
    // Se não houver destino ou se o item não foi movido
    if (!destination || destination.index === source.index) return;
  
    setExistingMedia((prevMedia) => {
      const reorderedMedia = Array.from(prevMedia);
      const [movedItem] = reorderedMedia.splice(source.index, 1);
      reorderedMedia.splice(destination.index, 0, movedItem);
      return reorderedMedia;
    });
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Playlist</h3>
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
              onChange={handleFileChange}
            />
          </label>

          {/* Exibindo as miniaturas das mídias existentes */}
          {existingMedia.length > 0 && (
            <div className="media-preview-container scrollable">
              <h4>Mídias existentes:</h4>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="media-list">
                  {(provided) => (
                    <div
                      className="media-thumbnails"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {existingMedia.map((media, index) => (
                        <Draggable
                          key={media.id}
                          draggableId={media.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="media-item"
                            >
                              {/* Exibindo a imagem a partir da URL */}
                              <img src={media.content} alt={`Media ${media.id}`} className="thumbnail" />
                              <button
                                type="button"
                                onClick={() => handleMediaDelete(media.id)}
                                className="delete-button"
                              >
                                <img src={BinIcon} alt="Excluir" />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder && (
                        <div className="draggable-placeholder"></div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}


          {/* Exibindo as miniaturas das mídias selecionadas */}
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
                      <p>Arquivo não suportado: {media.file.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={loading}>{loading ? 'Atualizando...' : 'Atualizar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModalPL;
