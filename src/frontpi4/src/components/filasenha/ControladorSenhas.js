import { useContext, useState } from "react";
import { SenhasContext } from "../../contexts/SenhasContext";
import styles from "./ControladorSenhas.module.css";
import Button from "./Button";

export default function ControladorSenhas() {
  const {
    handleNova,
    handlePrev,
    handleProx,
    handleClear,
    //handleLocalStorage,
  } = useContext(SenhasContext);
  // const [localStorageData] = useState(() => {
  //   const json = localStorage.getItem("data");
  //   return JSON.parse(json!) || null;
  // });

  //There has to be a better way to name this
  // function handleLocalStorage1() {
  //   handleLocalStorage(localStorageData.data);
  // }

  return (
    <div className={styles.responsiveButtons}>
      <button onClick={handleProx}>Chamar 1 senha posterior</button>
      <button onClick={handlePrev}>Chamar 1 senha anterior</button>
      <button onClick={() => handleNova(0)}>Gerar Convencional</button>
      <button onClick={() => handleNova(1)}>Gerar Preferencial</button>
      <button onClick={handleClear}>Limpar Todas as Senhas</button>
    </div>
  );
}

// function Modal({ children, options }) {
//   return (
//     <div className={styles.modal}>
//       <div className={styles.content}>
//         <h1>{children}</h1>
//         <div>
//           <Button>{options[0]}</Button>
//           <Button>{options[1]}</Button>
//         </div>
//       </div>
//     </div>
//   );
// }
