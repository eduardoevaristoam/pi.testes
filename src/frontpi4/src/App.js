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


function App() {


  const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false);
  const [isDeviceModalOpen, setDeviceModalOpen] = useState(false);

  const openPlaylistModal = () => setPlaylistModalOpen(true);
  const closePlaylistModal = () => setPlaylistModalOpen(false);

  const openDeviceModal = () => setDeviceModalOpen(true);
  const closeDeviceModal = () => setDeviceModalOpen(false);


  return (
    <div className="central-de-comando">
      <Header/>

      <main className="main-content">
        <Section title="Fila e senha">
          {/*<FilaSenha/> criar a linha para definir esse serviço ao dispositivo*/}
          <TabelaFS title1="Descrição do Serviço" title2="Opções" children1="Serviço Fila e Senha" children2="..."/>
        </Section>

        <Section title="Playlists" buttonLabel="+ Criar" onButtonClick={openPlaylistModal}>
          {<TabelaPL />/*implementação futura, paginacao 5 linhas + puxar conteúdo*/}
        </Section>

        <Section title="Dispositivos" buttonLabel="+ Criar" onButtonClick={openDeviceModal}>
          {<TabelaDV />/*implementacao futura, paginacao 5 linhas + puxar conteúdo db */}
        </Section>
      </main>
      <PlaylistModal isOpen={isPlaylistModalOpen} onClose={closePlaylistModal} />
      <DeviceModal isOpen={isDeviceModalOpen} onClose={closeDeviceModal} />
      
    </div>
  );
}

export default App;
