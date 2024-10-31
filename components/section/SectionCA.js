import React, {useState, useEffect} from 'react';
import Header from '../header/Header';
import Section from '../section/Section';
import PlaylistModal from '../modal/PlaylistModal';
import DeviceModal from '../modal/DeviceModal';
import FilaSenha from '../filasenha/FilaSenha';
import TabelaFS from '../tabela/TabelaFS';
import TabelaPL from '../tabela/TabelaPL';
import TabelaDV from '../tabela/TabelaDV';
import EditModalDV from '../modal/EditModalDV';
import styles from '../../App.css';

function SectionCA() {

  const [openModal, setOpenModal] = useState(null);

  const openModalHandler = (type) => setOpenModal(type);
  const closeModalHandler = () => setOpenModal(null);

  return (
    <div className="central-de-comando">
      <Header/>

      <main className="main-content">
        <Section title="Fila e senha">
          {/*<FilaSenha/> criar a linha para definir esse serviço ao dispositivo*/}
          <TabelaFS title1="Descrição do Serviço" title2="Opções" children1="Serviço Fila e Senha" children2="..."/>
        </Section>

        <Section title="Playlists" buttonLabel="+ Criar" onButtonClick={() => openModalHandler('playlist')}>
          {<TabelaPL />/*implementação futura, paginacao 5 linhas + puxar conteúdo*/}
        </Section>

        <Section title="Dispositivos" buttonLabel="+ Criar" onButtonClick={() => openModalHandler('device')}>
          {<TabelaDV />/*implementacao futura, paginacao 5 linhas + puxar conteúdo db */}
        </Section>
      </main>
      {openModal === 'playlist' && <PlaylistModal isOpen={true} onClose={closeModalHandler} />}
      {openModal === 'device' && <DeviceModal isOpen={true} onClose={closeModalHandler} />}
      
    </div>
  );
}

export default SectionCA;
