import React from 'react';
import './Modal.css';

function DeviceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Cadastrar Dispositivo</h3>
        <form>
          <label>
            Nome do Dispositivo:
            <input type="text" name="deviceName" />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeviceModal;
