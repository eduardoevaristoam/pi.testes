//Importação de componentes
import FilaSenhas from "./FilaSenhas";
import { Form, MediaVisualizer } from "./Visualizer";
import Header from "./components/Header/Header";

//Componente inteiro da UI
export default function App() {
  return (
    <>
      <Header>
        <FilaSenhas />
        <Form />
        <MediaVisualizer />

      </Header>
    </>
  );
}
