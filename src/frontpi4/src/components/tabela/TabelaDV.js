import styles from './Tabela.css';
import React, {useState} from 'react';

function TabelaDV(){
    return(
        <table className="service-table">
            <thead>
              <tr>
                <th>Nome Dispositivo</th>
                <th>Opções</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>nome1</td>
                <td>
                  <button onClick={""}>...</button>
                </td>
              </tr>
            </tbody>
        </table> 
    )
}

export default TabelaDV