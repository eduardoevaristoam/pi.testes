import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SectionLogin from "./components/section/SectionLogin";
import SectionCA from "./components/section/SectionCA";
import SectionDevice from "./components/section/SectionDevice";
import SectionApPLinDV from "./components/section/SectionApPLinDV";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`/sw.js`)
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SectionLogin />} />
        <Route path="/central-de-comando" element={<SectionCA />} />
        <Route path="/buscar-dispositivo" element={<SectionDevice />} />
        <Route
          path="/apresentacao-dispositivo/:dispositivo"
          element={<SectionApPLinDV />}
        />
      </Routes>
    </Router>
  );
}

export default App;
