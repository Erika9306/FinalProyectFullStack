import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Button } from '../../Button/Button'; 
import { useApi } from '../../../services/api.jsx';
import "./AdminPerson.css";

export const AdminPerson = React.memo(() => {   
  const [admin, setAdmin] = useState([]); 
  const [editUser, setEditUser] = useState(null);
  const [editAdminForm, setEditAdminForm] = useState(false); 
  const {requestAPI} = useApi();
  useEffect(() => {
    const listAdmins = async () => {
      try{
        const data = await requestAPI('/user');     
      const admins = data.filter(user => user.role === 'admin');
      setAdmin(admins);
      }catch(error){
        console.log("Error al cargar administradores", error);
        Swal.fire("Error", "No se pudieron cargar los administradores", "error");
      }
    };
    listAdmins();
  }, [requestAPI]);
  
  const retrieveUserInfo = useCallback((user) =>{        
    setEditUser(user);
    setEditAdminForm(true);
  },[]);
   
  const handleEdit = useCallback(async(e) => {
    e.preventDefault();
    if(!editUser) return;
    try{
      const response = await requestAPI(`/user/${editUser._id}`, 'PUT', editUser);             
      setAdmin(previous =>
        {if(editUser.role !=='admin'){
          return previous.filter(u => u._id !== editUser._id);
        }
        previous.map(u => u._id === editUser._id ? editUser : u)
      });
      setEditAdminForm(false);
      Swal.fire("¡Éxito!", `Administrador ${editUser.name} actualizado`, "success");      
    }catch(error){
      console.log("Error al editar los datos del administrador", error);
      Swal.fire("Error", "Error al editar los datos del administrador", "error", error);
    }
  }, [editUser,requestAPI]);
         
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
      const response = await requestAPI(`/user/${user._id}`, 'DELETE');
      if(response.ok){        
        setAdmin(prev => prev.filter(u => u._id !== user._id));
        Swal.fire('Eliminado', `Administrador ${user.name} eliminado`, 'success');
      }
    } catch(error) {
      console.log("No se puede borrar", error);
      Swal.fire("Error", "No se pudo eliminar el administrador", "error");
    }
  }, [requestAPI]);

  return (
    <div className="admins-container">
      <h2>🛡️ Administradores </h2>
      
      {editAdminForm && editUser && (
        <form className="edit-admin-form" onSubmit={handleEdit}>
          <h3>Editar Administrador</h3>
          <input 
            type="text" 
            value={editUser.name} 
            placeholder='Nombre Completo'
            onChange={(e) => setEditUser({...editUser, name: e.target.value})}
          />
          <input 
            type="email" 
            value={editUser.email} 
            placeholder='Email'
            onChange={(e) => setEditUser({...editUser, email: e.target.value})}
          />
                     
          <select   
            value={editUser.role}
            onChange={e => setEditUser({...editUser, role: e.target.value})}
          > 
            <option value="" disabled hidden>Cambiar rol...</option>           
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
    
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
