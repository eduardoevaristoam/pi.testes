/* 
falta criar o componente que traz as informações e alimenta os <tr />
das tabelas
*/

import styles from './Tabela.css';
import React, {useState} from 'react';

function TabelaPL(){
    return(
        <table className="service-table">
            <thead>
              <tr>
                <th>Nome Playlist</th>
                <th>Quantidade de mídia</th>
                <th>Tempo exibição</th>
                <th>Opções</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>nomepl1</td>
                <td></td>
                <td></td>
                <td>
                  <button onClick={""}>...</button>
                </td>
              </tr>
              <tr>
                <td>nomepl2</td>
                <td></td>
                <td></td>
                <td>
                  <button onClick={""}>...</button>
                </td>
              </tr>
              <tr>
                <td>nomepl3</td>
                <td></td>
                <td></td>
                <td>
                  <button onClick={""}>...</button>
                </td>
              </tr>
            </tbody>
        </table> 
    )
}

export default TabelaPL