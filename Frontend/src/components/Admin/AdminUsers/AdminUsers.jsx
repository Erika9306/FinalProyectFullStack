import React, { useCallback, useEffect,  useMemo,  useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import "./AdminUsers.css";
import{ Button } from '../../Button/Button';


//usamos React.memo para memorizar el componente y evitar renders innecesarios
export const AdminUsers = React.memo(() => {
  const URL = "https://finalproyectfullstack.onrender.com";
  const [users, setUsers] = useState([]);
  const [addUserForm, setAddUserForm] = useState (false);
  const [editUserForm, setEditUserForm]= useState(false);
  const [editUser, setEditUser] = useState(null); 
  const [searchUser, setSearchUser] = useState('');

  
  
  useEffect(() => {
    const listUsers = async () => {
      const res = await fetch(`${URL}/api/v1/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();     
      setUsers(data || []);
    };

    listUsers();
  }, []);

  const {register,
    handleSubmit,
    reset,
    formState:{ errors }} = useForm();


  
  //CREAR USUARIO
  const createUser = useCallback(async (data) =>{
    try{
      const response = await fetch(`${URL}/api/v1/user/register`, {
        method: "POST",
        headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type":"application/json"
        },        
          body: JSON.stringify(data),
        });      
      const result = await response.json();
      console.log("Usuario creado por admin", response);

      if(!response.ok){

        console.log("Error al crear usuario", response);
        Swal.fire("Error","Error al crear usuario", "error");
        return;
      }
      //añadir el nuevo usuario a la lista
      setUsers(prev => [...prev, result]);

      Swal.fire("Creado","Usuario creado correctamente", "success");
        reset(); 
        setAddUserForm(false);
  }catch(error){

      console.error("Error al crear usuario:", error);
      Swal.fire("Error en el servidor. Inténtalo de nuevo más tarde.");
      return;
    }
  },[]);

 
  //  EDITAR 
  //usamos useCallback para memorizar la función y así se renderiza una vez
  //cargar usuario para luego poder usarlo en el form
    const retrieveUserInfo = useCallback((user) =>{
      setEditUser(user);
      setEditUserForm(true);
    },[]);
 
  const handleEdit = useCallback(async(e )=> {
    e.preventDefault();
    if(!editUser) return;
    try{
      const response = await fetch(`${URL}/api/v1/user/${editUser._id}`,{
        method: "PUT",
        headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"          
          }, 
          // fusionamos los datos nuevos con antiguos
          body: JSON.stringify(editUser)
        }
      );
      if(response.ok){
       
        setUsers(previous => previous.map(u => u._id === editUser._id? editUser: u));
        setEditUserForm(false);
        
         Swal.fire("Exito!", `Usuario ${editUser.name} actualizado correctamente`, "success");
      }else{
        Swal.fire(`Error, Ne su pudo actualizar el perifl de usuario ${editUser.name}`);
      }
    }catch(error){
      console.log(error);
      Swal.fire("Error", "Error al editar", "error");
      return;

    }
  },
    [editUser]);
       

  //  BORRAR
  const deleteUser = useCallback(async (user) => {
    try{
    const result = await Swal.fire({
      title: `¿Estás seguro que quieres eliminar ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#f33a19',
    });
    
    if (!result.isConfirmed) return;
    const response =  await fetch(`${URL}/api/v1/user/${user._id}`,{
       method: "DELETE",
       headers:{
        "Authorization": `Bearer ${localStorage.getItem('token')}`, 
       "Content-Type": "application/json"        
       }      
     });

     console.log("Token enviado:", localStorage.getItem('token'));

if(response.ok){
  
        //filtramos para que los que NO tienen el mismo id se queden sin borrar
      setUsers(prev=> prev.filter(u=> u._id !== user._id));
    Swal.fire('Eliminado', `Usuario ${user.name} eliminado correctamente`, 'success');
}
}catch(error){
  console.log("No se puede borrar el usuario", error);
}

  }, []);


  // DETALLE

  const detailsUser = useCallback(async(user) => {   
    const response = await fetch(`${URL}/api/v1/list/favourites/${user._id}`,{
      method: "GET",
      headers:{
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"        
      }
  });

    const result = await response.json();
    console.log('datos de peliculas vistas por usuario', result);
    let moviesData = result.movies || [];
    //listmovie se guardará las pelicuasl vistoas pro el usuario
    let listMovie = '';
    if(moviesData.length > 0){
       listMovie = moviesData.map(m => 
        `<li><img src ='${m.movie?.imgUrl}' style = "width: 30px; height: 40px;"/>${m.movie?.title}</li>`
      ).join('');
    }else{
       listMovie = `<li>no hay todavía</li>`;
    }

  Swal.fire({
    title: `Detalles de  ${user.name}`,    
    html: `
    <div style="text-align: center; margin-bottom: 15px;">
          <img src="${user.img}" 
               alt="Foto" 
               style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #f1f1f1;"/>
        </div>
        <div style="text-align: left; line-height: 1.6;">
          <p><b>🛡️ Rol:</b> <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:12px;">${user.role}</span></p>
          <p><b>🆔 ID:</b> <small>${user._id}</small></p>
          <p><b>📧 Email:</b> ${user.email}</p>
          <p><b>📅 Creado:</b> ${new Date(user.createdAt).toLocaleDateString()}</p>
          <p><b>🎬 Películas:</b> ${listMovie}</p>
        </div>
    `,
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#f33a19',
  });
},[]);

//use memeo guardara la lista de búsqueda y es SINCRONO(sin async)
const search = useMemo(()=>{
  const inputUser = searchUser.toLowerCase().trim();
  if(!inputUser){
    return [];
  }
  console.log('Buscando usuario', inputUser,searchUser);
  return users.filter(u=> u.name.toLowerCase().trim().includes(inputUser));
  
},[ users, searchUser]);
//search, usamos ya la info que sacamso de Db
//const search = users.filter(user => user.name.toLowerCase());

  return (
    <div className='users-table'>
      <h2> 👤 Usuarios Registrados</h2>
    
      <h3>Total: {users.length} usuarios</h3>

      <div className='search-user'>
        <input className='search-user-input'
        type="text"
        placeholder='🔍 Buscar usuario'
        value = {searchUser}
        onChange = {(e) => setSearchUser(e.target.value)}
        />
     {searchUser !== '' && (
    <div className='search-result-div'>
      {search.length === 0 ? (
        <p>No se encontró ningún usuario "{searchUser}"</p>
      ) : (
        <div className="results-list">
              {search.map(s => (
                
                <div key={s._id} className="search-item-row">
                  <p className="search-item"> {s.name}</p>
                  <Button
                  text={'Detalle'}
                   onClick={() => detailsUser(s)}
                   className={'button-primary'}
                   />
                  <Button 
                  text={'Editar'} 
                  onClick={() => retrieveUserInfo(s)} 
                  className={'button-secondary'}
                  />
                  <Button text={'Borrar'}
                   onClick={() => deleteUser(s)} 
                   className={'button-danger'} />
                </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>
        
       {!addUserForm &&
       <Button
       text={'➕ Añadir Usuario'}
       onClick={() => setAddUserForm(true)}
       className={'button-primary add-user-btn'}
       />
     }
     
     {addUserForm && (      
      <form onSubmit ={handleSubmit(createUser)} className='create-user-form'>
        <h3>➕ Añadir Usuario</h3> 
        <input 
        type='text'
        placeholder='Nombre Completo'
        {...register('name', {required: true, maxLength:100})} />
        <input
        type='email'
        placeholder='Email'
         {...register('email', {required: true, maxLength:50})} />
        <input
        type='password'
        placeholder='Contraseña'
         {...register('password', {required: true, maxLength:50})} />
       
          <select   
          {...register('role', {required: true})} 
          >            
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        
        {errors.name && <span className='errors'>Nombre es obligatorio</span>  }
        {errors.email && <span className='errors'>Email es obligatorio</span>  }
        {errors.password && <span className='errors'>Password es obligatorio</span>  }
        {errors.role && <span className='errors'>Rol es obligatorio</span>  }
       <div className='form-btn'>
        <Button 
        type='submit' 
        text={'Guardar'}
        className={'button-secondary'} />
        <Button 
        text={'Cancelar'}
          type='button'
          onClick ={(e) =>{ 
            e.preventDefault();
            setAddUserForm(false);
            reset();
          }}
          className={'button-danger cancel-btn'}
          />
        </div>
      </form>
)}
      
{editUserForm && editUser && (
  <form onSubmit={handleEdit} className='edit-user-form'>
    <h3>✏️ Editar Usuario</h3> 
    
    <input 
      type='text'
      placeholder='Nombre Completo'
      value={editUser.name}
      onChange={e => setEditUser({...editUser, name: e.target.value})} 
    />
   
    <input
      type='email'
      placeholder='Email'
      value={editUser.email}
      onChange={e => setEditUser({...editUser, email: e.target.value})} 
    />
    
    <select   
      value={editUser.role}
      onChange={e => setEditUser({...editUser, role: e.target.value})}
    >            
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
    
    <div className='form-btn'>
      <Button
        type='submit' 
        text={'Guardar'}
        className={'button-secondary'} />
      <Button 
        text={'Cancelar'}
        type='button'
        onClick ={(e) =>{ 
            e.preventDefault();
            setEditUserForm(false);
            reset();
          }}
        className={'button-danger'}
      />
    </div>
  </form>
)}
    
  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th className='th-email'>Email</th>
        <th className='th-rol'>Rol</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      
      {users.map(user => (
        <tr key={user._id}>
          <td>{user.name}</td>              
          <td className='td-email'>{user.email}</td>
          <td className='td-role'>{user.role}</td>
          <td className='actions'> 
                <Button
                text={'👁️ Detalle'}
                onClick={() => detailsUser(user)}
                className={'button-primary'}
                />
                <Button
                text={'✏️ Editar'}
                onClick={() => retrieveUserInfo(user)}
                className={'button-secondary'}
                />
                <Button
                text={'🗑️ Borrar'}
                onClick={() => deleteUser(user)}
                className={'button-danger'}
                />
          </td>
        </tr>
      ))}
         </tbody>
    </table>
  </div>
  );
});