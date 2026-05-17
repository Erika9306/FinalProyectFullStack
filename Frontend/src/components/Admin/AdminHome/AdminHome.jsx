import React, { useEffect, useState, useContext} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { useApi } from '../../../services/api.jsx'; 
import "./AdminHome.css";

export default function AdminHome() {

  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const { token, logout } = useContext(AuthContext); 
  const {requestAPI} = useApi();
  useEffect(() => {
    const fetchData = async () => {
      
      if (!token) {
        console.warn("No hay token guardado.");       
        return;
      }

      try {
        const [userData, movieData] = await Promise.all([
          requestAPI('/user'),
          requestAPI('/movies')
        ]);
        
        setUsers(userData?? []);
        setMovies(movieData?? []);
      } catch (err) {
        console.error("Error cargando Admin dashboard:", err);
        logout();
      } 
    };

    fetchData();
  }, [token, logout, requestAPI]);

    return (
    <div className="admin-container">
      <h2>📊 Información General</h2>

      <section className="info-content">
        {/* Card Usuarios */}
        <div className="info-users-card">
          <Link to="/admin/users" className="admin-link">
            <div className="info-users-icon">👤</div>
            <div className="info-users-details">
              <h3>Usuarios</h3>
            </div>
          </Link>
          <p>{users.length}</p>
        </div>

        {/* Card Películas */}
        <div className="info-movies-card">
          <Link to="/admin/movies" className="admin-link">
            <div className="info-movies-icon">🎬</div>
            <div className="info-movies-details">
              <h3>Películas</h3>
            </div>
          </Link>
          <p>{movies.length}</p>
        </div>

        {/* Card Administradores */}
        <div className="info-admins-card">
          <Link to="/admin/admins" className="admin-link">
            <div className="info-admins-icon">🛡️</div>
            <div className="info-admins-details">
              <h3>Administradores</h3>
            </div>
          </Link>
          <p>{users.filter(u => u.role === 'admin').length}</p>
        </div>
      </section>
    </div>
  );
}