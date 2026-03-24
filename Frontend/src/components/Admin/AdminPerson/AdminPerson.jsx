import React from 'react';
import "./AdminPerson.css";
import { useState, useEffect } from 'react';


export default function AdminPerson() {
  const URL = "https://finalproyectfullstack.onrender.com"; 
  const [admin,setAdmin] = useState([]); 

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
      console.log("Usuarios:", data);
      const admins = data.filter(user => user.role === 'admin');
      console.log("Administradores:", admins);
      setAdmin(admins);
    };

      listAdmins();
    }, []);

 
  return (

      <div className="admin-person-container">
        <h3> 🛡️ Administradores</h3>
        <div className='admin-list'>
          <ul>
            {admin.map(admins => (
              <li key={admins.id}>
                <p><strong>Nombre:</strong> {admins.name}</p>
                <p><strong>Email:</strong> {admins.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
  )
};
