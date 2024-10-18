import React, {useState} from 'react';
import './Tabela.css';

function Tabela({title1, title2 , children1}){
    
    const [showServiceOptions, setShowServiceOptions] = useState(false);//controla visibilidade da lista de dispositivos

    const toggleServiceOptions = () => setShowServiceOptions(!showServiceOptions);

    return(
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
                  <button>...</button>
                </td>
              </tr>
            </tbody>
        </table> 
    );
}

export default Tabela