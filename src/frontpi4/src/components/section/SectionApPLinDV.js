import { useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";

const initalState = {
  currentMedia: 0,
  media: [],
  timeout: null,
  appStatus: "loading",
};
function reducer(state, action) {
  switch (action.type) {
    case "addMedia":
      return {
        ...state,
        media: action.payload.Midia,
        timeout: action.payload.intervalo,
        appStatus: "ready",
      };
    case "nextMedia":
      return {
        ...state,
        currentMedia:
          state.media.length === state.currentMedia + 1
            ? 0
            : state.currentMedia + 1,
      };
    case "previousMedia":
      return {
        ...state,
        currentMedia:
          state.currentMedia === 0
            ? state.media.length - 1
            : state.currentMedia - 1,
      };
    case "noPlaylist":
      return { ...state, appStatus: "empty" };
    default:
      console.error("Invalid action type");
      return state;
  }
}

export default function SectionApPLinDV() {
  const [{ currentMedia, media, timeout, appStatus }, dispatch] = useReducer(
    reducer,
    initalState
  );
  const video = useRef(null);
  const text = useRef(null);
  const updatedAt = useRef(null);
  //console.log(video.current)
  const { dispositivo } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const resDispositivo = await fetch(
          `https://api-p-i-4.onrender.com/devices/${dispositivo}`
        );
        console.log(dispositivo);
        const reqDispositivo = await resDispositivo.json();
        const dispositivoPlaylist = reqDispositivo.data.idPlaylist;
        if (!dispositivoPlaylist) return dispatch({ type: "noPlaylist" });

        const resPlaylist = await fetch(
          `https://api-p-i-4.onrender.com/playlists/${dispositivoPlaylist}?media=true`
        );
        const data = await resPlaylist.json();
        if (updatedAt.current !== data.data.updatedAt) {
          updatedAt.current = data.data.updatedAt;
          dispatch({ type: "addMedia", payload: data.data });
        } else {
          return;
        }
      } catch (err) {
        console.error("Something went wrong");
      }
    }
    fetchData();
    //Intervalo de busca de mídia
    setInterval(() => {
      console.log("buscando");
      fetchData();
    }, 30 * 1000);
  }, []);

  useEffect(() => {
    //id do intervalo
    let intervalId;

    //Função para decidir que tipo de intervalo teremos, imagem (normal) ou vídeo (timeout diferente)
    function updateInterval() {
      //Obtendo o mimetype da mídia atual
      const mimetype = media[currentMedia]?.mimetype;

      //Só roda o interval se as mídias já tiverem sido carregadas, impedindo de setar um timer na primeira render
      if (appStatus === "ready") {
        if (mimetype.includes("image")) {
          intervalId = setInterval(() => {
            dispatch({ type: "nextMedia" });
          }, timeout * 1000);
        } else if (mimetype.includes("video")) {
          intervalId = setInterval(() => {
            dispatch({ type: "nextMedia" });
          }, (video.current.duration + timeout) * 1000);
        }
      }
    }

    //Se o ref apontar para o vídeo, adiciona-se um eventListener que espera até seus metadados serem carregados (para já termos acesso à duração dele quando chamarmos a callback updateInterval que vai atribuir um interval )
    if (media[currentMedia]?.mimetype.includes("video")) {
      video.current?.addEventListener("loadedmetadata", updateInterval);
    } else {
      //Se a mídia for uma foto, ref é null, e nosso intervalo deve ser o padrão
      updateInterval();
    }
    //Limpando os intervalo e event listeners
    return () => {
      clearInterval(intervalId);
      video.current?.removeEventListener("loadedmetadata", updateInterval);
    };
    //currentMedia deve estar para esse effect rodar sempre que a mídia muda e limpar os intervalos e? listeners anteriores
  }, [timeout, appStatus, currentMedia, media]);

  useEffect(() => {
    const callback = (e) => {
      if (e.key === "ArrowRight") dispatch({ type: "nextMedia" });
      if (e.key === "ArrowLeft") dispatch({ type: "previousMedia" });
    };
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  });

  useEffect(() => {
    if (text.current) {
      text.current.innerHTML = media[currentMedia].content;
    }
  }, [currentMedia]);

  return (
    <div>
      {media.length === 0 && appStatus === "empty" && (
        <p>Não há uma playlist associada a este dispositivo</p>
      )}

      {media.length === 0 ? (
        <p>Carregando</p>
      ) : (
        <>
          {media[currentMedia].mimetype.includes("image") && (
            <img
              src={media[currentMedia].content}
              style={{ width: "100%", height: "100vh" }}
              alt="media"
            />
          )}
          {media[currentMedia].mimetype.includes("video") && (
            <video
              autoPlay
              src={media[currentMedia].content}
              style={{ width: "100%", height: "100vh" }}
              ref={video}
            />
          )}
          {media[currentMedia].mimetype.includes("text") && (
            <div
              ref={text}
              style={{
                display: "flex",
                justifyContent: "center",
                minHeight: "100vh",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {media.content}
            </div>
          )}
        </>
      )}
    </div>
  );
}
