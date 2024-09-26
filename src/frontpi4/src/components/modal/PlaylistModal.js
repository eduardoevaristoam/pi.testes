import React, {useState} from 'react';
import './Modal.css';

function PlaylistModal({ isOpen, onClose }) {
  if (!isOpen) return null;


  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Criar Playlist</h3>
        <form>
          <label>
            Nome da Playlist:
            <input type="text" />
          </label>
          <label>
            Tempo de exibição (segundos):
            <input type="number" min="1" step="1"  />
          </label>
          <label>
            Adicionar mídia:
            <input type="file" name="playlistMedia" multiple />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Criar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaylistModal;
