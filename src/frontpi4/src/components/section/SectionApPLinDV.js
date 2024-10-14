import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SectionApPLinDV() {
  const { dispositivo } = useParams();
  const [midias, setMidias] = useState([]);

  useEffect(() => {
    // Buscar as mídias vinculadas ao dispositivo
    fetch(`http://localhost:4000/devices/${dispositivo}/midias`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setMidias(data.data);
        }
      });
  }, [dispositivo]);

  return (
    <div>
      <div className="slides">
        {midias.map((media, index) => (
          <img key={index} src={media.content} alt={`Mídia ${index}`} />
        ))}
      </div>
    </div>

    /*
    pra buscar a midia de um dispositivo que ja inseri o nome, precisarei fazer isso:
    127.0.0.1:4000/devices/"30"
    ele me retorna um data.data.idPlaylist, se idPl for null, entao retornar mensagem
    se nao for null, entao
    127.0.0.1:4000/playlists/${data.data.idPlaylist}
    */ 
  );
}

export default SectionApPLinDV;
