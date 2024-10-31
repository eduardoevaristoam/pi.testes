import React, { useState } from 'react';
import '../modal/Modal.css';
import EditModalDV from '../modal/EditModalDV';
import EditModalPL from '../modal/EditModalPL';
import AtribuirDV from '../modal/AtribuirDV';
import AtribuirPL from '../modal/AtribuirPL';
import AtribuirFS from '../filaesenha/AtribuirFS';

function OpcoesMenu({ direction, data, Id, name, onClose }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const [openModal, setOpenModal] = useState(null);
    const openModalHandler = (type) => setOpenModal(type);
    const closeModalHandler = () => setOpenModal(null);

    // Funções para os botões do menu
    const handleAtribuirServico = () => {
        if(direction == "devices"){
            openModalHandler('atribuirpl');
        }
        if(direction == "playlists"){
            openModalHandler('atribuirpl');
        }
        if(direction == "atribuirfs"){
            openModalHandler('atribuirfs');
        }
 
    };

    const handleEditar = () => {
        if(direction == "devices"){
            openModalHandler('editmodaldv');
        }
        if(direction == "playlists"){
            openModalHandler('editmodalpl');
        }
    };

    const handleExcluir = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch(`http://localhost:4000/${direction}/${Id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir ${direction}`);
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
                    {direction !== "devices" && (
                        <button type="button" onClick={handleAtribuirServico}>Atribuir Serviço</button>
                    )}

                    {direction !== "atribuirfs" && (
                        <button type="button" onClick={handleEditar}>Editar</button>
                    )}

                    {direction !== "atribuirfs" && (
                        <button type="button" onClick={handleExcluir} disabled={loading}>
                            {loading ? 'Excluindo...' : 'Excluir'}
                        </button>
                    )}

                    <button type="button" onClick={onClose}>Cancelar</button>
                </div>
                {message && <div style={{ color: 'green' }}>{message}</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
            {openModal === 'editmodaldv' && <EditModalDV Id={Id} isOpen={true} onClose={closeModalHandler} />}
            {openModal === 'editmodalpl' && <EditModalPL Id={Id} isOpen={true} onClose={closeModalHandler} />}
            {openModal === 'atribuirdv' && <AtribuirDV Id={Id} isOpen={true} onClose={closeModalHandler} />}
            {openModal === 'atribuirpl' && <AtribuirPL Id={Id} isOpen={true} onClose={closeModalHandler} />}
            {openModal === 'atribuirfs' && <AtribuirFS Id={1} isOpen={true} onClose={closeModalHandler} />}
        </div>
    );
}

export default OpcoesMenu;
