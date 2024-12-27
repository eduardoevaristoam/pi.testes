import { useContext } from "react";
import { RightColumn, LeftColumn } from "./Columns";
import Senha from "./Senha";
import { SenhasContext } from "../../contexts/SenhasContext";
import styles from "./FilaSenhas.module.css";

export default function FilaSenhas() {
  const { state } = useContext(SenhasContext); // Access queue and current step
  const { queue, currentStep } = state;

  return (
    <>
      {/* Global Reset Styles Scoped to this Component */}
      <style>
        {`
          .filaSenhasRoot * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Quicksand", sans-serif;
            font-optical-sizing: auto;
            font-style: normal;
          }
        `}
      </style>
      <div className={`filaSenhasRoot ${styles.wrapper}`}>
        <RightColumn>
          {/* Render the current "senha" */}
          {queue.length > 0 && (
            <Senha
              senha={queue[queue.length - currentStep - 1]}
              atual={true}
              key={Date.now()} // Ensure unique keys
            />
          )}
        </RightColumn>
        <LeftColumn>
          {queue[queue.length - currentStep - 2] && (
            <Senha
              senha={queue[queue.length - currentStep - 2]} // 1st previous senha
              key={`prev-1`}
            />
          )}
          {queue[queue.length - currentStep - 3] && (
            <Senha
              senha={queue[queue.length - currentStep - 3]} // 2nd previous senha
              key={`prev-2`}
            />
          )}
          {queue[queue.length - currentStep - 4] && (
            <Senha
              senha={queue[queue.length - currentStep - 4]} // 3rd previous senha
              key={`prev-3`}
            />
          )}
        </LeftColumn>
      </div>
    </>
  );
}
