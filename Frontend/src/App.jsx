import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import UserHome from "./components/User/UserHome/UserHome.jsx";
import AdminHome from "./components/Admin/AdminHome/AdminHome.jsx";

import {AdminPerson} from "./components/Admin/AdminPerson/AdminPerson.jsx";
import { AdminUsers } from "./components/Admin/AdminUsers/AdminUsers.jsx";
import { AdminMovies } from "./components/Admin/AdminMovies/AdminMovies.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import { isTokenValid } from "./utils/isTokenValid.js";

import MovieDetail from "./components/User/MovieDetail/MovieDetail.jsx";
import { UserFavourite } from "./components/User/UserFavourite/UserFavourite.jsx";
import {UserProfile} from"./components/User/UserProfile/UserProfile.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import "./App.css";

function App() {
  //obtenemos solo el token y el role del contexto,
  //  ya que los necesitamos para acceso a rutas correspondientes
  const { token, role} = useContext(AuthContext);
  const isValidUser = token && isTokenValid(token);

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          isValidUser ? (
            // Si el token existe y  es válido, redirigimos según el rol
            <Navigate to={role === "admin" ? "/admin/home" : "/user/home"} replace />
            ) : (
            // Si NO hay token o está caducado, mostramos el formulario de Login
            <Login/>
            )
          }
    />


      {/* Registro */}
      <Route path="/register" element={
        isValidUser ? (
          // Si el token existe y es válido, redirigimos según el rol haciendo auto-login
          <Navigate to={role === "admin" ? "/admin/home" : "/user/home"} replace />
        ) : (
          // Si NO hay token o está caducado, mostramos el formulario de Registro
          <Register/>
        )

      } />

      {/* Usuario */}
      <Route
        path="/user/home"
        element={
          <ProtectedRoute requiredRole="user">            
            <UserHome />            
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/movie/:id"
        element={
          <ProtectedRoute requiredRole="user">            
            <MovieDetail />
          </ProtectedRoute>
            }
      />
      <Route
        path="/user/favourite"
        element={
          <ProtectedRoute requiredRole="user">            
            <UserFavourite />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute requiredRole="user">            
            <UserProfile/>
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/home"
        element={
          <ProtectedRoute requiredRole="admin">           
            <AdminHome />
          </ProtectedRoute>
        }
      />

      {/* Admin: lista de usuarios */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">            
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      {/* Admin: lista de películas */}
      <Route
        path="/admin/movies"
        element={
          <ProtectedRoute requiredRole="admin">            
            <AdminMovies/>
          </ProtectedRoute>
        }
      />
        {/* Admin: persona */}  
      <Route
        path="/admin/admins"
        element={
          <ProtectedRoute requiredRole="admin">           
            <AdminPerson/>
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route
        path="*"
        element={
          !isValidUser ? (
            <Navigate to="/login" replace />
          ) : role === "admin" ? (
            <Navigate to="/admin/home" replace />
          ) : (
            <Navigate to="/user/home" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
