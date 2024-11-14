import React, { useEffect, useState } from "react";
import "./Modal.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import BinIcon from "../assets/BinIcon.png";

function EditModalPL({ Id, isOpen, onClose }) {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistIntervalo, setPlaylistIntervalo] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscaDadosById = async (Id) => {
    try {
      const response = await fetch(
        `https://api-p-i-4.onrender.com/playlists/${Id}`
      );
      const data = await response.json();
      setPlaylistName(data.data.nome);
      setPlaylistIntervalo(data.data.intervalo);
      buscaMidiasById(Id);
    } catch (error) {
      console.error("Erro ao buscar dados da playlist:", error);
    }
  };

  const buscaMidiasById = async (Id) => {
    try {
      const response = await fetch(
        `https://api-p-i-4.onrender.com/playlists/${Id}/media`
      );
      const mediaData = await response.json();
      if (mediaData.status === "success") {
        setExistingMedia(mediaData.data);
        setAllMedia([...mediaData.data]); // Inicialmente carrega as mídias existentes
      }
    } catch (error) {
      console.error("Erro ao buscar mídias da playlist", error);
    }
  };

  useEffect(() => {
    if (isOpen && Id) {
      buscaDadosById(Id);
    } else {
      setPlaylistName("");
      setPlaylistIntervalo("");
      setMediaFiles([]);
      setExistingMedia([]);
      setAllMedia([]);
    }
  }, [isOpen, Id]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      id: `new-${file.name}`, // Gera um ID único para cada mídia nova
      file,
      preview: URL.createObjectURL(file),
      isNew: true, // Marca como mídia nova
    }));
    setMediaFiles(selectedFiles);
    setAllMedia([...allMedia, ...selectedFiles]); // Adiciona as novas mídias à lista de todas as mídias
  };

  const handleMediaDelete = async (mediaId) => {
    if (window.confirm("Você tem certeza que deseja excluir esta mídia?")) {
      if (!mediaId.startsWith("new-")) {
        // Somente apaga mídias do servidor
        try {
          const response = await fetch(
            `https://api-p-i-4.onrender.com/media/${mediaId}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            setExistingMedia(
              existingMedia.filter((media) => media.id !== mediaId)
            );
            setAllMedia(allMedia.filter((media) => media.id !== mediaId));
          } else {
            console.error("Erro ao excluir mídia:", await response.json());
          }
        } catch (error) {
          console.error("Erro na requisição de exclusão de mídia:", error);
        }
      } else {
        // Para mídias novas que ainda não foram enviadas ao servidor
        setMediaFiles(mediaFiles.filter((media) => media.id !== mediaId));
        setAllMedia(allMedia.filter((media) => media.id !== mediaId));
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      mediaFiles.forEach((media) => {
        formData.append("media", media.file);
      });

      const response1 = await fetch(
        `https://api-p-i-4.onrender.com/playlists/${Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: playlistName,
            intervalo: parseInt(playlistIntervalo, 10),
          }),
        }
      );

      const response = await fetch(
        `https://api-p-i-4.onrender.com/playlists/${Id}/media`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const data1 = await response1.json();
      if (response.ok && response1.ok) {
        console.log("Playlist atualizada com sucesso:", data);
        onClose();
        window.location.reload();
      } else {
        console.error("Erro ao atualizar playlist:", data.message);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função de reorganização no drag and drop
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    setAllMedia((prevMedia) => {
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
          <label>
            <h4>Mídias:</h4>
          </label>

          {/* Exibindo as miniaturas de todas as mídias (existentes e novas) */}
          {allMedia.length > 0 && (
            <div className="media-preview-container scrollable">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="media-list">
                  {(provided) => (
                    <div
                      className="media-thumbnails"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {allMedia.map((media, index) => (
                        <Draggable
                          key={media.id}
                          draggableId={media.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="media-item"
                            >
                              {media.isNew ? (
                                <>
                                  {media.file.type.startsWith("image") ? (
                                    <div className="media-item">
                                      <img
                                        src={media.preview}
                                        alt={media.file.name}
                                        className="thumbnail"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleMediaDelete(media.id)
                                        }
                                        className="delete-button"
                                      >
                                        <img src={BinIcon} alt="Excluir" />
                                      </button>
                                    </div>
                                  ) : media.file.type.startsWith("video") ? (
                                    <div className="media-item">
                                      <video
                                        src={media.preview}
                                        controls
                                        className="thumbnail"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleMediaDelete(media.id)
                                        }
                                        className="delete-button"
                                      >
                                        <img src={BinIcon} alt="Excluir" />
                                      </button>
                                    </div>
                                  ) : (
                                    <p>
                                      Arquivo não suportado: {media.file.name}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <>
                                  <img
                                    src={media.content}
                                    alt={`Media ${media.id}`}
                                    className="thumbnail"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleMediaDelete(media.id)}
                                    className="delete-button"
                                  >
                                    <img src={BinIcon} alt="Excluir" />
                                  </button>
                                </>
                              )}
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
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModalPL;
