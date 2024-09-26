import React, { useState } from 'react';
import '../modal/Modal.css';
import DeviceModal from '../modal/DeviceModal';

function OpcoesMenu({ deviceId, nameDevice, onClose }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Funções para os botões do menu
    const handleAtribuirServico = () => {
        alert(`Atribuir serviço ao dispositivo: ${nameDevice}`);
    };

    const handleEditar = () => {
        alert(`Editar dispositivo: ${nameDevice}`);
    };

    const handleExcluir = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch(`http://localhost:4000/devices/${deviceId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir dispositivo');
            }

            const data = await response.json();
            setMessage(data.message);
        } catch (err) {
            setError(err.message);
        } finally {
          onClose();
          window.location.reload(); //mudar para algo que só atualize os cadastrados
          setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-buttons">
                    <button type="button" onClick={handleAtribuirServico}>Atribuir Serviço</button>
                    <button type="button" onClick={handleEditar}>Editar</button>
                    <button type="button" onClick={handleExcluir} disabled={loading}>
                        {loading ? 'Excluindo...' : 'Excluir'}
                    </button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </div>
                {message && <div style={{ color: 'green' }}>{message}</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
        </div>
    );
}

export default OpcoesMenu;
