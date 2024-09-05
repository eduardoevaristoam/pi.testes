//Importação de componentes
import FilaSenhas from "./FilaSenhas";
import { Form, MediaVisualizer } from "./Visualizer";

//Componente inteiro da UI
export default function App() {
  return (
    <>
      <FilaSenhas />
      <Form />
      <MediaVisualizer />
    </>
  );
}
