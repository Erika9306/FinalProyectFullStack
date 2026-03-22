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
                    setValue('img', result.img);   
                }
            } catch (error) {
                console.error("Error al obtener info", error);
            }
        };
            userInfo();
        }, [userId, token, setValue]);   
        
       //  ACTUALIZAR PERFIL
    const handleEdit = useCallback(async (userData) => {      
        if(!userData.password){
            //si no hay contraseña, se borra el campo y no se manda al backend
             //no cambia la contraseña antigua
            delete userData.password;
            }
        try {
            const response = await fetch(`${URL}/api/v1/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
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
    },[token, userId, reset]);

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
                    navigate('/login');
                }
            } catch (error) {
                console.log("Error al borrar", error);
            }
        }
    },[token, userId,navigate]);

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
                    <input{...register('img')} placeholder='Imagen deseada'/>
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
                                 reset();
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



