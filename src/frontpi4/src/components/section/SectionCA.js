import React, { useState, useEffect, useContext } from "react";
import Header from "../header/Header";
import Section from "../section/Section";
import PlaylistModal from "../modal/PlaylistModal";
import DeviceModal from "../modal/DeviceModal";
import FilaSenha from "../filasenha/FilaSenhas";
import TabelaFS from "../tabela/TabelaFS";
import TabelaPL from "../tabela/TabelaPL";
import TabelaDV from "../tabela/TabelaDV";
import EditModalDV from "../modal/EditModalDV";
import styles from "../../App.css";
import { useLogin } from "../../contexts/AuthContext";
import AvisoModal from "../modal/AvisoModal";
import Loader from "../assets/Loader";

function SectionCA() {
  const [openModal, setOpenModal] = useState(null);

  const openModalHandler = (type) => setOpenModal(type);
  const closeModalHandler = () => setOpenModal(null);
  //Consumindo valor do context
  const { isLogged, isLoading } = useLogin();

  if (isLoading) return <Loader />;

  return !isLogged ? (
    <AvisoModal>
      <h3>Você não tem acesso a esta página!</h3>
      <p>Por favor faça login ou direcione-se à exibição de mídias</p>
    </AvisoModal>
  ) : (
    <div className="central-de-comando">
      <Header />

      <main className="main-content">
        <Section title="Fila e senha">
          {/*<FilaSenha/> criar a linha para definir esse serviço ao dispositivo*/}
          <TabelaFS
            title1="Descrição do Serviço"
            title2="Opções"
            children1="Serviço Fila e Senha"
            children2="..."
          />
        </Section>

        <Section
          title="Playlists"
          buttonLabel="+ Criar"
          onButtonClick={() => openModalHandler("playlist")}
        >
          {
            <TabelaPL /> /*implementação futura, paginacao 5 linhas + puxar conteúdo*/
          }
        </Section>

        <Section
          title="Dispositivos"
          buttonLabel="+ Criar"
          onButtonClick={() => openModalHandler("device")}
        >
          {
            <TabelaDV /> /*implementacao futura, paginacao 5 linhas + puxar conteúdo db */
          }
        </Section>
      </main>
      {openModal === "playlist" && (
        <PlaylistModal isOpen={true} onClose={closeModalHandler} />
      )}
      {openModal === "device" && (
        <DeviceModal isOpen={true} onClose={closeModalHandler} />
      )}
    </div>
  );
}

export default SectionCA;
