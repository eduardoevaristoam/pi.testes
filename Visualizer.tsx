//ESSE COMPONENTE SÓ EXISTE POR RAZÕES DE TESTE, NÃO NECESSARIAMENTE FAZ PARTE DA APLICAÇÃO, NOTE QUE ELE NÃO ESTÁ ESTRUTURADO CORRETAMENTE
import { useState, useEffect, useRef } from "react";

const acceptedMimeTypes: string[] = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  // Videos
  "video/mp4",
  "video/mpeg",
  "video/webm",
  "video/x-msvideo",
];

//Form recebia acceptedMimeTypes como props, se algo der errado, reinserir  {acceptedMimeTypes} como argumento
export function Form() {
  //State do arquivo
  const [file, setFile] = useState(null);
  const filesInput = useRef(null);

  //Handler do input[type=file]
  function handleChange(e) {
    const file = e.target.files[0] || null;
    console.log(file);
    setFile(file);
  }

  //Handler de quando der submit
  async function handleSubmit(e) {
    e.preventDefault();
    //Se o state file ainda for null
    if (!file) {
      //window.alert("Somwthing went wrong");
      return;
    }

    //Criando objeto FormData e passando o arquivo pra ele
    const formData = new FormData();
    formData.append("media", file);

    //Try-Catch com a request POST
    try {
      const req = await fetch("http://127.0.0.1:4000/media", {
        method: "POST",
        body: formData,
      });
      const res = await req.json();
      console.log(res);
      console.log(formData);
      window.alert("Alright");
    } catch (error) {
      window.alert("Something went wrong");
      console.error(error.message);
    } finally {
      setFile(null);
    }
  }

  function handleClick() {
    filesInput.current.click();
  }

  function handleDeselect() {
    setFile(null);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="media-form">
        <label htmlFor="upload">Selecione uma mídia</label>
        <input
          type="file"
          ref={filesInput}
          onChange={handleChange}
          name="upload"
          accept={acceptedMimeTypes as unknown as string}
          className="files-input"
        />
        <p>{file ? file.name : "Nenhum arquivo selecionado"}</p>
        <button onClick={handleClick}>Selecionar mídia</button>
        {file && <button onClick={handleDeselect}>Desselecionar mídia</button>}
        {file && <input type="submit" value="Upload" />}
      </form>
      <Text />
    </>
  );
}

export function MediaVisualizer() {
  const [media, setMedia] = useState([]);
  //Totally for testing purposes
  const [selectedMedia, setSelectedMedia] = useState(null);

  /*
    useEffect(() => {
      async function fetchData() {
        try{
          const req = await fetch("http://127.0.0.1:4000/media");
          const res = await req.json();
          //setMedia(res);
          setMedia(res.data);
          console.log(res.data)
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchData();
    }, [])
    */

  /*
    async function handleClick() {
      try {
        const req = await fetch("http://127.0.0.1:4000/media");
        const res = await req.json();
        //setMedia(res);
        setMedia(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error.message);
      }
    }
      */

  useEffect(() => {
    async function fetchData() {
      try {
        const req = await fetch("http://127.0.0.1:4000/media");
        const res = await req.json();
        //setMedia(res);
        setMedia(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();
  }, []);

  //Totally for testing purposes
  function handleSelect(uuid) {
    setSelectedMedia(uuid === selectedMedia ? null : uuid);
  }

  async function handleDeleteMedia(uuid) {
    const mimetype = media.find((media) => media.uuid === uuid).mimetype;
    console.log(mimetype);

    // Prepare headers for the fetch request
    const headers = new Headers();

    // If the mimetype is "text/plain", add the isText header
    if (mimetype === "text/plain") {
      headers.append("istext", "true");
    }

    try {
      const response = await fetch(`http://127.0.0.1:4000/media/${uuid}`, {
        method: "DELETE",
        headers: headers, // Include headers in the request
      });
      const res = await response.json();
      console.log(res);

      // Update the state after successful deletion
      setMedia((prevMedia) => prevMedia.filter((media) => media.uuid !== uuid));
      setSelectedMedia(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div>
        {/*<button onClick={handleClick}>Obter mídias</button>*/}
        {selectedMedia && (
          <button onClick={() => handleDeleteMedia(selectedMedia)}>
            Deletar mídia
          </button>
        )}
      </div>
      <div className="media__visualizer">
        {media.map((media) => (
          <Media
            mediaObj={media}
            key={media.uuid}
            onSelect={handleSelect}
            selected={selectedMedia === media.uuid}
          />
        ))}
      </div>
    </div>
  );
}

//classname is for testing purposes, as well as onSelect and selected
function Media({ mediaObj, onSelect, selected }) {
  return (
    <div
      className={`media ${selected ? "selected" : ""}`}
      onClick={() => onSelect(mediaObj.uuid)}
    >
      {mediaObj.mimetype.includes("image") && (
        <img src={mediaObj.content} width="200px" height="200px"></img>
      )}
      {mediaObj.mimetype.includes("video") && (
        <video src={mediaObj.content} width="200px" height="200px"></video>
      )}
      {mediaObj.mimetype.includes("text") && (
        <div
          style={{
            width: "200px",
            height: "200px",
            overflow: "hidden",
            textWrap: "wrap",
            textAlign: "center",
          }}
        >
          {mediaObj.content}
        </div>
      )}
    </div>
  );
}

function Text() {
  const [text, setText] = useState("");

  function handleChange(e) {
    setText(e.target.value);
  }

  function handleClear() {
    setText("");
  }

  //Função pra enviar request, usando fetch e passando objeto com definições (essa request é independente da de outras mídas, pq já tem objeto headers e body predefinido)
  async function handleSubmit() {
    try {
      const req = await fetch("http://127.0.0.1:4000/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, mimetype: "text/plain" }),
      });
      const res = await req.json();
      console.log(res);
      handleClear();
      alert("Texto enviado");
    } catch (error) {
      console.error(error.message);
      alert("Algo deu errado");
    }
  }

  return (
    <div className="text__input__container">
      <textarea
        className="text__input"
        maxLength={100}
        minLength={1}
        value={text}
        onChange={handleChange}
        style={{ width: "350px", height: "200px", resize: "none" }}
      ></textarea>
      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
}
