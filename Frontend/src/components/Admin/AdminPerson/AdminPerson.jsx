import React, { useState, useEffect } from 'react';
import "./AdminPerson.css";

export const AdminPerson = React.memo(() => {
  const URL = "https://finalproyectfullstack.onrender.com"; 
  const [admin, setAdmin] = useState([]); 

  useEffect(() => {
    const listAdmins = async () => {
      const res = await fetch(`${URL}/api/v1/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();     
      const admins = data.filter(user => user.role === 'admin');
      setAdmin(admins);
    };
    listAdmins();
  }, []);

  return (
    <div className="admins-container">
      <h3>🛡️ Administradores ({admin.length})</h3>
      <div className="admin-list">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>                        
            </tr>
          </thead>
          <tbody>
            {admin.map(adm => (
              <tr key={adm._id}>
                <td><strong>{adm.name}</strong></td>
                <td>{adm.email}</td>                                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});