import React, { createContext, useEffect, useState } from "react";
import { isTokenValid } from "../utils/isTokenValid.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
  
    //mientras carga la información  mostramos "Loading"
    useEffect(() => {  
      const savedToken = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");
      const savedUserId = localStorage.getItem("userId");
      if(savedToken && isTokenValid(savedToken)) {
        setToken(savedToken);
        setRole(savedRole);
        setUserId(savedUserId);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
      }
        
      setLoading(false);
    }, []);
  
    if (loading) return <div>Cargando...</div>;

    //metemos en el contexto login y logut ya que ellos cambian totalmente el estado de la aplicación,
    // y el token y el role para que estén disponibles en toda la aplicación

   const login = (newToken, newRole, newUserId) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
  };

  // para terminar la sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUserId(null);
  };
 //provider es el que da el contexto a toda la aplicación, 
 // y el value es lo que queremos compartir en toda la aplicación,
 // sin él no tendríamos esa información accesible
  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};