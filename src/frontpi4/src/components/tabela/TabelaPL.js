/* 
falta criar o componente que traz as informações e alimenta os <tr />
das tabelas
*/

import styles from './Tabela.css';
import React, {useState} from 'react';
import OpcoesMenu from './OpcoesMenu';

function TabelaPL(){

  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);
  const openOptionsModal = () => setOptionsModalOpen(true);
  const closeOptionsModal = () => setOptionsModalOpen(false);

  const handleButtonClick = () => {
    setOptionsModalOpen(!isOptionsModalOpen);
  };

  return(
    <table className="service-table">
        <thead>
          <tr>
            <th>Nome Playlist</th>
            <th>Quantidade de mídia</th>
            <th>Tempo exibição</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {/*{playlist.map((playlist) => (
            <tr key={playlist.id}>
              <td>playlist.name</td>
              <td>playlist.qtd</td>
              <td>playlist.time</td>
              <td>
                <button onClick={handleButtonClick}>...</button>
                {isOptionsModalOpen && <OpcoesMenu selectedPlaylist={playlist.name} onClose={handleButtonClick}/>}
              </td>
            </tr>
            ))}*/}
          <tr>
            <td>nomepl2</td>
            <td></td>
            <td></td>
            <td>
              <button onClick={handleButtonClick}>...</button>
              {isOptionsModalOpen && <OpcoesMenu selectedDevice="name" onClose={handleButtonClick}/>}
            </td>
          </tr>
          <tr>
            <td>nomepl3</td>
            <td></td>
            <td></td>
            <td>
              <button onClick={handleButtonClick}>...</button>
              {isOptionsModalOpen && <OpcoesMenu selectedDevice="name" onClose={handleButtonClick}/>}
            </td>
          </tr>
        </tbody>
    </table> 
  )
}

export default TabelaPL