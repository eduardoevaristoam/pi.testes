import React, { useState } from "react";
import "./Tabela.css";
import OpcoesMenu from "./OpcoesMenu";
import OpcoesMenuFilaSenha from "./OpcoesMenuFilaSenha";

function TabelaFS({ title1, title2, children1 }) {
  const [showOptions, setShowOptions] = useState(false); // Estado para controlar a visibilidade do OpcoesMenu

  const handleToggleOptions = () => {
    setShowOptions(!showOptions); // Alterna entre mostrar ou ocultar o menu
  };

  return (
    <div>
      <table className="service-table">
        <thead>
          <tr>
            <th>{title1}</th>
            <th>{title2}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{children1}</td>
            <td>
              <button onClick={handleToggleOptions}>...</button>
              {showOptions && (
                <OpcoesMenuFilaSenha onClose={() => setShowOptions(false)} />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TabelaFS;
