import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Button } from '../../Button/Button'; 
import "./AdminPerson.css";

export const AdminPerson = React.memo(() => {
  const URL = "https://finalproyectfullstack.onrender.com"; 
  const [admin, setAdmin] = useState([]); 
  const [editUser, setEditUser] = useState(null);
  const [editAdminForm, setEditAdminForm] = useState(false); 

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
  
  const retrieveUserInfo = useCallback((user) =>{        
    setEditUser(user);
    setEditAdminForm(true);
  },[]);
   
  const handleEdit = useCallback(async(e) => {
    e.preventDefault();
    if(!editUser) return;
    try{
      const response = await fetch(`${URL}/api/v1/user/${editUser._id}`,{
        method: "PUT",
        headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"          
        }, 
        body: JSON.stringify(editUser)
      });
      if(response.ok){
        
        setAdmin(previous => previous.map(u => u._id === editUser._id ? editUser : u));
        setEditAdminForm(false);
        Swal.fire("¡Éxito!", `Admin ${editUser.name} actualizado`, "success");
      }
    }catch(error){
      Swal.fire("Error", "Error al editar", "error", error);
    }
  }, [editUser]);
         
  const deleteUser = useCallback(async (user) => {
    try{
      const result = await Swal.fire({
        title: `¿Eliminar a ${user.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        confirmButtonColor: '#f33a19',
      });
      
      if (!result.isConfirmed) return;
      const response = await fetch(`${URL}/api/v1/user/${user._id}`,{
         method: "DELETE",
         headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`, 
          "Content-Type": "application/json"        
         }      
      });

      if(response.ok){        
        setAdmin(prev => prev.filter(u => u._id !== user._id));
        Swal.fire('Eliminado', `Administrador ${user.name} eliminado`, 'success');
      }
    } catch(error) {
      console.log("No se puede borrar", error);
    }
  }, []);

  return (
    <div className="admins-container">
      <h3>🛡️ Administradores ({admin.length})</h3>
      
      {editAdminForm && editUser && (
        <form className="edit-admin-form" onSubmit={handleEdit}>
          <h2>Editar Administrador</h2>
          <input 
            type="text" 
            value={editUser.name} 
            onChange={(e) => setEditUser({...editUser, name: e.target.value})}
          />
          <input 
            type="email" 
            value={editUser.email} 
            onChange={(e) => setEditUser({...editUser, email: e.target.value})}
          />
          <Button 
            text="Guardar"
            type="submit"
            className="button-primary" />
          <Button 
            text="Cancelar"
            onClick={() => setEditAdminForm(false)}
            className="button-secondary" />
        </form>
      )}

      <div className="admin-list">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th> 
            </tr>
          </thead>
          <tbody>
            {admin.map(adm => (
              <tr key={adm._id}>
                <td><strong>{adm.name}</strong></td>
                <td>{adm.email}</td>                
                <td>
                  <div className="action-buttons">
                    <Button 
                      text="✏️" 
                      onClick={() => retrieveUserInfo(adm)} 
                      className="button-secondary" 
                    />
                    <Button 
                      text="🗑️" 
                      onClick={() => deleteUser(adm)} 
                      className="button-danger" 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
