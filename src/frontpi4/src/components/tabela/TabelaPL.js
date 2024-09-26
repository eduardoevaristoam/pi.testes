/* 
falta criar o componente que traz as informações e alimenta os <tr />
das tabelas
*/

import styles from './Tabela.css';
import React, {useState, useEffect} from 'react';
import OpcoesMenu from './OpcoesMenu';

function TabelaPL(){

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);
  const openOptionsModal = () => setOptionsModalOpen(true);
  const closeOptionsModal = () => setOptionsModalOpen(false);

  const handleButtonClick = (playlist) => {
    setSelectedPlaylist(playlist === selectedPlaylist ? null : playlist);
  };

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    try{
      const response = await fetch('http://localhost:4000/playlists');
      if(!response.ok){
        throw new Error('Erro ao buscar playlist');
      }
      const data = await response.json();
      setPlaylists(data.data);
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaylists();
  }, []);

  if(loading){
    return <div>Loading...</div>;
  }

  if(error){
    return <div>Error: {error}</div>;
  }

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
         {playlists.map((playlist) => (
          <tr key={playlist.id}>
            <td>{playlist.nome}</td>
            <td>{playlist._count.Midia}</td>
            <td>{playlist.intervalo}</td>
            <td>
              <button onClick={() => handleButtonClick(playlist.id)}>...</button>
              {selectedPlaylist === playlist.id && (<OpcoesMenu direction="playlists" Id={playlist.id} name={playlist.name} onClose={() => setSelectedPlaylist(null) } />)}
            </td>
          </tr>
         ))}
        </tbody>
    </table> 
  )
}

export default TabelaPL