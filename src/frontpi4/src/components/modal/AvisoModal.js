import { useNavigate } from "react-router-dom";

function AvisoModal({ children }) {
  const navigate = useNavigate();
  function handleRedirect(e, page) {
    e.preventDefault();
    navigate(`/${page}`);
  }
  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <div className="modal-buttons">
          <button
            type="button"
            onClick={(e) => handleRedirect(e, "buscar-dispositivo")}
          >
            Exibição de mídias
          </button>
          <button type="button" onClick={(e) => handleRedirect(e, "login")}>
            Fazer login
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvisoModal;
