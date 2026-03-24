import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import UserHome from "./components/User/UserHome/UserHome.jsx";
import AdminHome from "./components/Admin/AdminHome/AdminHome.jsx";
import AdminNavbar from "./components/Admin/AdminNavbar/AdminNavbar.jsx";
import AdminPerson from "./components/Admin/AdminPerson/AdminPerson.jsx";
import { AdminUsers } from "./components/Admin/AdminUsers/AdminUsers.jsx";
import { AdminMovies } from "./components/Admin/AdminMovies/AdminMovies.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import { isTokenValid } from "./utils/isTokenValid.js";
import NavBar from "./components/User/NavBar/NavBar.jsx";
import MovieDetail from "./components/User/MovieDetail/MovieDetail.jsx";
import { UserFavourite } from "./components/User/UserFavourite/UserFavourite.jsx";
import {UserProfile} from"./components/User/UserProfile/UserProfile.jsx";

function App() {

  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  //mientras carga la información  mostramos "Loading"
  useEffect(() => {  
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    setToken (savedToken);
    setRole (savedRole);  
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          token && isTokenValid(token) ? (
            // Si el token existe y  es válido, redirigimos según el rol
            <Navigate to={role === "admin" ? "/admin/home" : "/user/home"} replace />
            ) : (
            // Si NO hay token o está caducado, mostramos el formulario de Login
            <Login setToken={setToken} setRole={setRole} />
            )
          }
    />


      {/* Registro */}
      <Route path="/register" element={
        token && isTokenValid(token) ? (
          // Si el token existe y es válido, redirigimos según el rol haciendo auto-login
          <Navigate to={role === "admin" ? "/admin/home" : "/user/home"} replace />
        ) : (
          // Si NO hay token o está caducado, mostramos el formulario de Registro
          <Register setToken={setToken} setRole={setRole} />
        )

      } />

      {/* Usuario */}
      <Route
        path="/user/home"
        element={
          <ProtectedRoute token={token} role={role} requiredRole="user">
            <NavBar setToken={setToken} setRole={setRole}/>
            <UserHome />            
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/movie/:id"
        element={
          <ProtectedRoute token={token} role={role} requiredRole="user">
            <NavBar setToken={setToken} setRole={setRole}/>
            <MovieDetail />
          </ProtectedRoute>
            }
      />
      <Route
        path="/user/favourite"
        element={
          <ProtectedRoute token={token} role={role} requiredRole="user">
            <NavBar setToken={setToken} setRole={setRole}/>
            <UserFavourite />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute token={token} role={role} requiredRole="user">
            <NavBar setToken={setToken} setRole={setRole}/>
            <UserProfile/>
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/home"
        element={
          <ProtectedRoute token={token} role={role} requiredRole="admin">
            <AdminNavbar  setToken={setToken} setRole={setRole}/>
            <AdminHome />
          </ProtectedRoute>
        }
      />

      {/* Admin: lista de usuarios */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute token={token} role={role} requiredRole="admin">
            <AdminNavbar  setToken={setToken} setRole={setRole}/>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      {/* Admin: lista de películas */}
      <Route
        path="/admin/movies"
        element={
          <ProtectedRoute token={token} role={role} requiredRole="admin">
            <AdminNavbar  setToken={setToken} setRole={setRole}/>
            <AdminMovies/>
          </ProtectedRoute>
        }
      />
        {/* Admin: persona */}  
      <Route
        path="/admin/admins"
        element={
          <ProtectedRoute token={token} role={role} requiredRole="admin">
            <AdminNavbar  setToken={setToken} setRole={setRole}/>
            <AdminPerson/>
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route
        path="*"
        element={
          !token ? (
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
