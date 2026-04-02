import React, { useState, useEffect } from 'react';
import "./AdminPerson.css";
import{ Button } from 'src/components/Button/Button';

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
    <div className="admin-person-container">
      <h3>🛡️ Administradores ({admin.length})</h3>
      <ul className="admin-vertical-list">
        {admin.map(adm => (
          <li key={adm._id} className="admin-card">
            <div className="admin-info">
              <p><strong>{adm.name}</strong></p>
              <p><small>{adm.email}</small></p>
            </div>
            
            <div className="admin-actions">
              <Button 
                text="👁️ Detalle" 
                onClick={() => console.log("Detalle", adm._id)} 
                className="button-primary" 
              />
              <Button 
                text="✏️ Editar" 
                onClick={() => console.log("Editar", adm._id)} 
                className="button-secondary" 
              />
              <Button 
                text="🗑️ Borrar" 
                onClick={() => console.log("Borrar", adm._id)} 
                className="button-danger" 
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});
