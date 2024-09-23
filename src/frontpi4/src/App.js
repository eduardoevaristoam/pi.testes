import React, {useState} from 'react';
import Header from './components/header/Header';
import Section from './components/section/Section';
import PlaylistModal from './components/modal/PlaylistModal';
import DeviceModal from './components/modal/DeviceModal';
import FilaSenha from './components/filasenha/FilaSenha';
import './App.css';

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
        </Section>

        <Section title="Playlists" buttonLabel="+ Criar" onButtonClick={openPlaylistModal}>
          {/*implementação futura, paginacao 5 linhas + puxar conteúdo*/}
        </Section>

        <Section title="Dispositivos" buttonLabel="+ Criar" onButtonClick={openDeviceModal}>
          {/*implementacao futura, paginacao 5 linhas + puxar conteúdo db */}
        </Section>
      </main>
      <PlaylistModal isOpen={isPlaylistModalOpen} onClose={closePlaylistModal} />
      <DeviceModal isOpen={isDeviceModalOpen} onClose={closeDeviceModal} />
    </div>
  );
}

export default App;
