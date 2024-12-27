import styles from "./FilaSenhas.module.css";
//Componente do container/coluna do lado direito
export function RightColumn({ children }) {
  return <div className="right__column">{children}</div>;
}

//Componente do container/coluna do lado esquerdo
export function LeftColumn({ children }) {
  return <div className="left__column">{children}</div>;
}
