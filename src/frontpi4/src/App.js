import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SectionLogin from "./components/section/SectionLogin";
import SectionCA from "./components/section/SectionCA";
import SectionDevice from "./components/section/SectionDevice";
import SectionApPLinDV from "./components/section/SectionApPLinDV";
import { AuthProvider } from "./contexts/AuthContext";
import { RightColumn } from "./components/filasenha/Columns";
import { SenhasProvider } from "./contexts/SenhasContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import FilaSenhas from "./components/filasenha/FilaSenhas";
import ControladorSenhas from "./components/filasenha/ControladorSenhas";

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register(`/sw.js`)
//       .then((registration) => {
//         console.log(
//           "ServiceWorker registration successful with scope: ",
//           registration.scope
//         );
//       })
//       .catch((error) => {
//         console.log("ServiceWorker registration failed: ", error);
//       });
//   });
// }

function App() {
  return (
    <WebSocketProvider>
      <SenhasProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route index element={<SectionLogin />} />
              <Route path="/login" element={<SectionLogin />} />
              <Route path="/central-de-comando" element={<SectionCA />} />
              <Route path="/buscar-dispositivo" element={<SectionDevice />} />
              <Route
                path="/apresentacao-dispositivo/:dispositivo"
                element={<SectionApPLinDV />}
              />
              <Route path="/fila-senha/apresentacao" element={<FilaSenhas />} />
              <Route
                path="/fila-senha/controle"
                element={<ControladorSenhas />}
              />
            </Routes>
          </Router>
        </AuthProvider>
      </SenhasProvider>
    </WebSocketProvider>
  );
}

export default App;
