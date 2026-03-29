import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {Button} from '../../Button/Button'
import "./UserProfile.css";


export const UserProfile = () => {
    const URL = "https://finalproyectfullstack.onrender.com";

    const [user, setUser] = useState(null);
    const [editAccount, setEditAccount]= useState(false);   
    const [uploadFile, setUploadFile] = useState('url');
    const {register, handleSubmit, setValue, reset} = useForm();    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const userId = jwtDecode(token)._id;

    useEffect(()=>{
     
        const userInfo = async () => {
            try {
                
                const response = await fetch(`${URL}/api/v1/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                });
                const result = await response.json();

                if (response.ok) {
                    console.log("datos de usuario", result);
                    setUser(result);
                    //setvalue ayudará que al terminar fetch el usuario vea sus datos actuales que estan en el DB
                    setValue('name', result.name);
                    setValue('imgUrl', result.img);   
                }
            } catch (error) {
                console.error("Error al obtener info", error);
            }
        };
            userInfo();
        }, [userId, token, setValue]);   
        

        //cada vez que el usuario cambie, se actualizan los campos del formulario con los datos actuales del usuario
      
       //  ACTUALIZAR PERFIL
    const handleEdit = useCallback(async (userData) => {  
        const picture = new FormData();
        picture.append('name', userData.name);
           
        if(userData.password){
            //si no hay contraseña nueva, se mantiene la antigua
            picture.append('password', userData.password);
            }
            //comprobamos que usario usba algo de Pc, si no, se mantieen la url antigua
        if(uploadFile === "file" && userData.imgFile && userData.imgFile.length > 0){
            picture.append("img", userData.imgFile[0]);
        }else{
        //si el usuario no sube imagen, se mantiene la antigua url
        picture.append("img", userData.imgUrl);
        }
    
        try {
            const response = await fetch(`${URL}/api/v1/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: picture
            });

            const result = await response.json();
            if (response.ok) {
                //copiamos antiguo y nuevo, solo que guarda lo cambiado
                setUser(prev=> ({ ...prev, ...result }));
                reset();
                //para cerrar el formulario
                setEditAccount(false);
                Swal.fire("Éxito", "Perfil actualizado", "success");
            }
        } catch (error) {
            console.log("No se pudo actualizar el perfil", error);
            Swal.fire("Error", "No se pudo actualizar", "error");
        }
        //mandamos todas las dependecias 
        //ya que si no, funcion no renovará los datos de usuario
    },[token, userId, reset, uploadFile]);


    // BORRAR CUENTA
    const deleteAccount = useCallback(async () => {
        const result = await Swal.fire({
            title: '¿Quieres eliminar tu cuenta?',
            text: "Esta acción es irreversible",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f33a19',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${URL}/api/v1/user/${userId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                });
                if (response.ok) {
                    localStorage.removeItem('token');
                    localStorage.clear();
                    await Swal.fire('Eliminado', 'Tu cuenta ya no existe', 'success');
                    window.location.href = "/login"; 
                }
            } catch (error) {
                console.log("Error al borrar", error);
            }
        }
    },[token, userId]);

    if(!user){
        return <div> Cargando datos...</div>
    }
    
    return (
        <div className="profile-container" >
            <h2>Mi Perfil</h2>
            <div className="current-info" >
                <img src={user.img} alt="Perfil"  className='profile-img' />
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Nombre:</strong> {user.name}</p>
            </div>

            {!editAccount ? (
                <Button
                text={"Editar Perfil"}
                onClick={() => setEditAccount(true)}
                className={'button-primary'}
                />
            ) : (
                <form onSubmit={handleSubmit(handleEdit)} className='edit-personal-info'>
                    <h3>Editar Datos</h3>
                    <input {...register ('name', {required: true, maxLength: 50})} placeholder='Nombre Completo'/>
                    <div className='select-img'>
                        <div className='toggle-buttons'>
                            <Button
                                type='button'
                                text={"Url de imagen"}
                                onClick={() => setUploadFile('url')}
                                className={uploadFile === 'url' ? 'active' : ''}
                            />
                            <Button
                                type='button'
                                text={"Avatar desde Pc"}
                                onClick={() => setUploadFile('file')}
                                className={uploadFile === 'file' ? 'active' : ''}
                            />
                        </div>
                        {uploadFile === 'url' ? (
                            <input
                                type="text"
                                {...register('imgUrl')}
                                placeholder='Url de imagen'
                            />
                        ) :  (
                            <input
                                type="file"
                                {...register('imgFile')}
                                accept="image/*"
                            />
                        ) 
                        }
             
                    </div>                    
                    <input{...register('password')} placeholder=" Déjelo en blanco si no desee cambiar "/>
                    <div>
                        <Button 
                            type="submit" 
                            text={"Guardar Cambios"} 
                            className={'button-secondary'}
                        />
                        <Button 
                            type="button" 
                            text={"Cancelar"} 
                            className='button-danger'
                            onClick={() => {                              
                                setEditAccount(false);
                                setValue('name', user.name);
                                setValue('imgUrl', user.img);
                                setUploadFile('url');
                                setValue('password', '');                                                     
                            }}
                        />
                    </div>
                </form>
            )}
            
            <Button
                text={"Eliminar Cuenta"}
                onClick={deleteAccount}
                className={"button-danger delete-account"}            
            />
        </div>
    );
};



