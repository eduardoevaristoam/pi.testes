//ESSE COMPONENTE SÓ EXISTE POR RAZÕES DE TESTE, NÃO NECESSARIAMENTE FAZ PARTE DA APLICAÇÃO, NOTE QUE ELE NÃO ESTÁ ESTRUTURADO CORRETAMENTE
import { useState, useEffect } from "react";

const acceptedMimeTypes : string[]  = [
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
      window.alert("Somwthing went wrong");
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

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="upload">Selecione uma mídia</label>
      <input
        type="file"
        onChange={handleChange}
        name="upload"
        accept={acceptedMimeTypes}
      />
      <input type="submit" value="Upload" />
    </form>
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
    try {
      const req = await fetch(`http://127.0.0.1:4000/media/${uuid}`, {
        method: "DELETE",
      });
      const res = await req.json();
      console.log(res);
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
    </div>
  );
}
