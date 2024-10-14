import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SectionLogin from './components/section/SectionLogin';
import SectionCA from './components/section/SectionCA';
import SectionDevice from './components/section/SectionDevice';
import SectionApPLinDV from './components/section/SectionApPLinDV';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SectionLogin />} />
        <Route path="/central-de-comando" element={<SectionCA />} />
        <Route path="/buscar-dispositivo" element={<SectionDevice />} />
        <Route path="/apresentacao-dispositivo/:dispositivo" element={<SectionApPLinDV />} />
      </Routes>
    </Router>
  );
}

export default App;
