import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../../utils/isTokenValid";

export default function ProtectedRoute({ requiredRole, token, role, children }) {
 const validToken = isTokenValid(token);
  if (!validToken) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if ( role !== requiredRole) {
    // Redirige según rol actual    
  return <Navigate to={role === "admin" ? "/admin/home" : "/user/home"} replace />;
    
  }
    
//si todo está bien, lleva al componente correspondiente: admin o user
  return children;
}
