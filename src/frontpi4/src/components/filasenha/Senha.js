import styles from "./FilaSenhas.module.css";

//Componente de Senha
export default function Senha({ senha, atual = false }) {
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
