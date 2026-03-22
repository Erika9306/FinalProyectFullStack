import React, { useEffect, useState } from "react";
import "./AdminHome.css";

export default function AdminHome() {
  const URL = "https://finalproyectfullstack.onrender.com";
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
 

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.warn("No hay token guardado.");       
        return;
      }

      try {
        const [userRes, movieRes] = await Promise.all([
          fetch(`${URL}/api/v1/user`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
          fetch(`${URL}/api/v1/movies`, {
            method:"GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
        ]);

        if (!userRes.ok || !movieRes.ok) {
          console.error("Token inválido o expirado", userRes.status, movieRes.status);
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const userData = await userRes.json();
        const movieData = await movieRes.json();

        setUsers(userData?? []);
        setMovies(movieData?? []);
      } catch (err) {
        console.error("Error cargando Admin dashboard:", err);
      } 
    };

    fetchData();
  }, []);

   return (
    <div className="admin-container">
      
        <h1>📊 Información General</h1>        
      

      <section className="info-content">
        <div className="info-users-card">
          <div className="info-users-icon">👤</div>
          <div className="info-users-details">
            <h3>Usuarios</h3>
            <p>{users.length}</p>
          </div>
        </div>

        <div className="info-movies-card">
          <div className="info-movies-icon">🎬</div>
          <div className="info-movies-details">
            <h3>Películas</h3>
            <p>{movies.length}</p>
          </div>
        </div>

        {/* Nueva Card: Ejemplo de filtro rápido */}
        <div className="info-admins-card">
          <div className="info-admins-icon">🛡️</div>
          <div className="info-admins-details">
            <h3>Administradores</h3>
            <p>{users.filter(u => u.role === 'admin').length}</p>
          </div>
        </div>
      </section>

     
    </div>
  );
}