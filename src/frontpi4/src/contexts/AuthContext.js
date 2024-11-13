import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AuthContext.Provider
      value={{ isLogged, setIsLogged, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useLogin() {
  const { setIsLogged, isLogged, isLoading, setIsLoading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function isUserLoggedIn() {
      try {
        //setIsLoading(true);
        const res = await fetch("https://api-p-i-4.onrender.com/login/check", {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data?.status !== "success") return;
        setIsLogged(true);
        navigate("/central-de-comando");
      } finally {
        setIsLoading(false);
      }
    }
    isUserLoggedIn();
  }, []);

  return { setIsLogged, isLogged, setIsLoading, isLoading };
}

export { AuthProvider, AuthContext, useLogin };
