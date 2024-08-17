import { useState } from "react";
/*
const senhas = Array.from({ length: 5 }, () => {
  return {
    tipo: "Convencional",
    senha: geradorSenha(),
    guiche: geradorGuiche(),
  };
});
*/

function geradorSenha() {
  const numeroAleatorio = Math.trunc(Math.random() * 500) + 1;
  return `D${numeroAleatorio}`;
}

function geradorGuiche() {
  return Math.trunc(Math.random() * 10) + 1;
}

console.log(geradorSenha());

//Componente inteiro da UI
export default function App() {
  //State pro array de objetos de senha
  const [senhas, setSenhas] = useState([]);
  const [stepSenha, setStepSenha] = useState(0);

  //Evento para ir à última senha possível, isso é, a nova senha que for gerada
  //TODO: Checar possibilidade de refatorar essa função usando condições dentro das outras duas funções
  function handleNova() {
    const novaSenha = {
      tipo: "Convencional",
      senha: geradorSenha(),
      guiche: geradorGuiche(),
    };
    setSenhas((prevSenhas) => [...prevSenhas, novaSenha]);
    setStepSenha(0);
    console.log(senhas);
  }

  //TODO: Não deixar o setSenha chegar em números negativos! - Feito
  //TODO: Quando não houverem senhas anteriores ou próximas, chamar a função handleNova! - Feito

  //Evento para ir à próxima senha sem gerar uma nova
  function handleProx() {
    if (stepSenha === 0) {
      handleNova();
    } else {
      setStepSenha((prevStepSenha) => prevStepSenha - 1);
    }
  }
  //Evento para ir à senha posterior
  function handlePrev() {
    setStepSenha((prevStepSenha) => prevStepSenha + 1);
  }
  return (
    <>
      <div className="wrapper">
        <RightColumn>
          <Senha senha={senhas[senhas.length - stepSenha - 1]} atual={true} />
        </RightColumn>
        <LeftColumn>
          <Senha senha={senhas[senhas.length - stepSenha - 2]} atual={false} />
          <Senha senha={senhas[senhas.length - stepSenha - 3]} atual={false} />
          <Senha senha={senhas[senhas.length - stepSenha - 4]} atual={false} />
        </LeftColumn>
      </div>

      <Controls>
        <button onClick={handleProx}>Chamar 1 senha posterior</button>
        <button onClick={handlePrev}>Chamar 1 senha anterior</button>
        <button onClick={handleNova}>Gerar e chamar nova senha</button>
      </Controls>
    </>
  );
}

//Componente do container do lado direito
function RightColumn({ children }) {
  return <div className="right__column">{children}</div>;
}

//Componente de Senha
function Senha({ senha, atual = false }) {
  return (
    senha && (
      <div className={`senha${atual ? "__atual" : ""}`}>
        <h3>{senha.tipo}</h3>
        <h1>{senha.senha}</h1>
        <h3>Guichê {senha.guiche}</h3>
      </div>
    )
  );
}

//Componente do container do lado esquerdo
function LeftColumn({ children }) {
  return <div className="left__column">{children}</div>;
}

//Componente dos botões debaixo da "visão principal"
function Controls({ children }) {
  return <div className="controls">{children}</div>;
}
