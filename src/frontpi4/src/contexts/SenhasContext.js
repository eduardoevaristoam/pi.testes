import { createContext, useState, useEffect } from "react";
import { useWebSocket } from "./WebSocketContext";

const SenhasContext = createContext({});

// Initial empty state for the context
const initialState = {
  queue: [],
  currentStep: 0,
};

function SenhasProvider({ children }) {
  const [state, setState] = useState(initialState); // Local state mirrors server state
  const socket = useWebSocket();

  useEffect(() => {
    if (socket) {
      // Listen for messages from the WebSocket server
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);

        if (data.type === "update") {
          // Update local state with data from the server
          setState({ queue: data.queue, currentStep: data.currentStep });
        } else if (data.type === "error") {
          console.error(data.message);
        }
      };
    }
  }, [socket]);

  // Actions send simple commands to the server
  function handleNova(tipo) {
    socket.send(JSON.stringify({ action: "generate", type: tipo }));
  }

  function handleProx() {
    socket.send(JSON.stringify({ action: "prev" }));
  }

  function handlePrev() {
    socket.send(JSON.stringify({ action: "next" }));
  }

  function handleClear() {
    socket.send(JSON.stringify({ action: "clear" }));
  }

  return (
    <SenhasContext.Provider
      value={{
        state, // Contains the queue and current step
        handleNova,
        handleProx,
        handlePrev,
        handleClear,
      }}
    >
      {children}
    </SenhasContext.Provider>
  );
}

export { SenhasProvider, SenhasContext };
