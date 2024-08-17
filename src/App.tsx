const senhas = Array.from({ length: 5 }, () => {
  return {
    tipo: "Convencional",
    senha: geradorSenha(),
    guiche: geradorGuiche(),
  };
});

function geradorSenha() {
  const numeroAleatorio = Math.trunc(Math.random() * 500) + 1;
  return `D${numeroAleatorio}`;
}

function geradorGuiche() {
  return Math.trunc(Math.random() * 10) + 1;
}

console.log(senhas);

console.log(geradorSenha());
export default function App() {
  return (
    <div className="wrapper">
      <RightColumn>
        <Senha senha={senhas[senhas.length - 1]} atual={true} />
      </RightColumn>
      <LeftColumn>
        <Senha senha={senhas[senhas.length - 2]} atual={false} />
        <Senha senha={senhas[senhas.length - 3]} atual={false} />
        <Senha senha={senhas[senhas.length - 4]} atual={false} />
      </LeftColumn>
    </div>
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
