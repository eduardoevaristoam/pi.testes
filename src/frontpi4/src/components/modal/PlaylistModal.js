import React, { useState } from "react";
import "./Modal.css";

function PlaylistModal({ isOpen, onClose }) {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistIntervalo, setPlaylistIntervalo] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setMediaFiles(selectedFiles);
  };

  function verInput(playlistName, playlistIntervalo) {
    if (playlistName === "" || playlistIntervalo === "") {
      return true;
    } else {
      return false;
    }
  }

  //funcao busca todas as playlist e analisa todas se existe o nome, retorna true ou false
  const checkPlaylistNameExist = async (playlistName) => {
    try {
      const response = await fetch(`https://api-p-i-4.onrender.com/playlists`);
      const data = await response.json();
      for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].nome === playlistName) {
          return true;
        }
      }
    } catch (error) {
      console.error("Erro ao verificar nome da playlist:", error);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // evita regarregamento da pag

    setLoading(true);
    setError(null);

    //funcao abaixo checa se ja existe a playlist atual a ser cadastrada
    //com o bd, se nome atual ja estiver cadastrado, o cadastro trava!
    //corrigir isso no futuro, mas por hora está funcional
    const nameExists = await checkPlaylistNameExist(playlistName);
    if (nameExists) {
      alert("playlist ja cadastrada com este nome.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api-p-i-4.onrender.com/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: playlistName,
          intervalo: parseInt(playlistIntervalo, 10),
        }),
      });

      const data = await response.json();
      //atualmente funciona até aqui, cria a playlist mas nao vincula as midias

      if (response.ok) {
        console.log("Playlist cadastrado com sucesso", data);

        for (const media of mediaFiles) {
          const formData = new FormData();
          formData.append("media", media.file);

          const mediaResponse = await fetch(
            `https://api-p-i-4.onrender.com/playlists/${data.data.id}/media`,
            {
              method: "POST",
              body: formData,
            }
          );

          const mediaData = await mediaResponse.json();
          if (mediaResponse.ok) {
            console.log("midia cadastrada com sucesso:", mediaData);
          } else {
            console.error("erro ao cadastrar midia", mediaData.message);
            break;
          }
        }
        setPlaylistName("");
        setPlaylistIntervalo("");
        setMediaFiles([]);
        mediaFiles.forEach((media) => {
          URL.revokeObjectURL(media.preview);
        });
        onClose();
        window.location.reload();
      } else {
        console.log("erro ao cadastrar a playlist");
      }
    } catch (error) {
      console.error("Erro na requisicao:", error);
    } finally {
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
              disabled={verInput(playlistName, playlistIntervalo)}
              type="file"
              name="playlistMedia"
              multiple
              onChange={handleFileChange} //captura os arquivos ao serem selecionados
            />
          </label>
          {/* exibindo as minituras das midias */}
          {mediaFiles.length > 0 && (
            <div className="media-preview-container">
              <h4>Mídias selecionadas:</h4>
              <div className="media-thumbnails">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="media-item">
                    {media.file.type.startsWith("image") ? (
                      <img
                        src={media.preview}
                        alt={media.file.name}
                        className="thumbnail"
                      />
                    ) : media.file.type.startsWith("video") ? (
                      <video
                        src={media.preview}
                        controls
                        className="thumbnail"
                      />
                    ) : (
                      <p>Arquivo nao suportado : {media.file.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaylistModal;
