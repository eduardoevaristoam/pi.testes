import React, { useState, useEffect } from 'react';

// Simulação de som
const playSound = () => {
  const audio = new Audio('/path/to/sound.mp3'); // Coloque o caminho correto do arquivo de som
  audio.play();
};

function FilaSenha() {
  const [currentNumber, setCurrentNumber] = useState(1); // Senha atual
  const [lastFiveNumbers, setLastFiveNumbers] = useState([]); // Últimas 5 senhas chamadas

  useEffect(() => {
    // Tocar som quando a senha mudar
    playSound();
  }, [currentNumber]);

  const chamarProxima = () => {
    setLastFiveNumbers(prev => [currentNumber, ...prev.slice(0, 4)]); // Atualiza as últimas 5 senhas
    setCurrentNumber(prev => prev + 1); // Chama a próxima senha
  };

  const chamarAnterior = () => {
    if (currentNumber > 1) {
      setLastFiveNumbers(prev => [currentNumber, ...prev.slice(0, 4)]); // Atualiza as últimas 5 senhas
      setCurrentNumber(prev => prev - 1); // Chama a senha anterior
    }
  };

  return (
    <div style={styles.container}>
      {/* Coluna das últimas 5 senhas chamadas */}
      <div style={styles.lastFive}>
        <h3>Últimas chamadas</h3>
        <ul>
          {lastFiveNumbers.map((num, index) => (
            <li key={index}>Senha: {num}</li>
          ))}
        </ul>
      </div>

      {/* Área principal de exibição da senha atual */}
      <div style={styles.mainDisplay}>
        <h1>Senha atual</h1>
        <div style={styles.numberDisplay}>
          <button onClick={chamarAnterior} style={styles.controlButton}>← Anterior</button>
          <span style={styles.currentNumber}>{currentNumber}</span>
          <button onClick={chamarProxima} style={styles.controlButton}>Próxima →</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  lastFive: {
    width: '20%',
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '8px',
  },
  mainDisplay: {
    width: '75%',
    textAlign: 'center',
    padding: '10px',
  },
  numberDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentNumber: {
    fontSize: '72px',
    margin: '0 20px',
    fontWeight: 'bold',
  },
  controlButton: {
    fontSize: '20px',
    padding: '10px',
    cursor: 'pointer',
  },
};

export default FilaSenha;
