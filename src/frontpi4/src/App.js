import React, {useState, useEffect} from 'react';
import './App.css';
import Header from './components/header/Header';
import Section from './components/section/Section';
import PlaylistModal from './components/modal/PlaylistModal';
import DeviceModal from './components/modal/DeviceModal';
import FilaSenha from './components/filasenha/FilaSenha';
import ServiceOptions from './components/serviceoptions/ServiceOptions';
import TabelaFS from './components/tabela/TabelaFS';
import TabelaPL from './components/tabela/TabelaPL';
import TabelaDV from './components/tabela/TabelaDV';
import EditModalDV from './components/modal/EditModalDV';


function App() {

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

export default App;
