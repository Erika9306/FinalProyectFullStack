import React, {useContext, useEffect} from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../../utils/isTokenValid";
import { AuthContext } from "../../context/AuthContext.jsx";
import NavBar from "../User/NavBar/NavBar.jsx";
import AdminNavbar from "../Admin/AdminNavbar/AdminNavbar.jsx";

export default function ProtectedRoute({ requiredRole,  children }) {
  
  //obtenemos token, rol y logout desde props childen del contexto
  const { token, role, logout } = useContext(AuthContext);
  const validToken = isTokenValid(token);
  useEffect(() => {
    // Verificar el token antes de visualizar el componente
    if (!validToken) {
      logout(); 
    }
  }, [validToken, logout]);

  if (!validToken) {
    // Si el token no es válido, redirige al login    
    return <Navigate to="/login" replace />;
  }

  if ( role !== requiredRole) {
    // Redirige según rol actual    
  return <Navigate to={role === "admin" ? "/admin/home" : "/user/home"} replace />;
    
  }
    
//si todo está bien, lleva al componente correspondiente con su navbar correspondiente: admin o user
  return (
    <>
      {role === "admin" ? <AdminNavbar /> : <NavBar />}
      {children}
    </>
  )
}
