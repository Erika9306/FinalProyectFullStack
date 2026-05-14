import React, { createContext, useEffect, useState } from "react";
import { isTokenValid } from "../utils/isTokenValid.js";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
  
    //mientras carga la información  mostramos "Loading"
    //metemos en el contexto login y logut ya que ellos cambian totalmente el estado de la aplicación,
    // y el token y el role para que estén disponibles en toda la aplicación

   const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    localStorage.setItem("role", decoded.role);
    localStorage.setItem("userId", decoded._id);
    setToken(token);
    setRole(decoded.role);
    setUserId(decoded._id);
  };

  // para terminar la sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");    
    setToken(null);
    setRole(null);
    setUserId(null);
  };
  
    useEffect(() => {  
      const savedToken = localStorage.getItem("token");
            
      if(savedToken && isTokenValid(savedToken)) {
        try {
          const decoded = jwtDecode(savedToken);
          setToken(savedToken);
          setRole(decoded.role);
          setUserId(decoded._id);
        } catch (error) {
          console.error("Error decoding token:", error);
          logout();
        }
      } else {
        logout();
      }
        
      setLoading(false);
    }, []);
  
    if (loading) return <div>Cargando...</div>;

    
 //provider es el que da el contexto a toda la aplicación, 
 // y el value es lo que queremos compartir en toda la aplicación,
 // sin él no tendríamos esa información accesible
  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};