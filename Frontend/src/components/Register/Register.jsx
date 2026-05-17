import React, {useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import {  useForm } from "react-hook-form";
import {jwtDecode} from "jwt-decode";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useApi } from '../../services/api.jsx'; 
import "./Register.css";


export default function Register() {
  const {requestAPI} = useApi();
  const {login} = useContext(AuthContext);  
  const navigate = useNavigate();
  //React Form Hook
  const {register,
    handleSubmit,
    setError,
    formState :{errors}} = useForm();

  const onRegister = async (data)=>{
    try {
      
      const response = await requestAPI('/user/register', 'POST',{
        name: data.name,
        email: data.email,
        password: data.password

       });      
     
      if(response.ok){
        localStorage.setItem("token",response.token);           
      }
      const decoded = jwtDecode(response.token);

      // Guardar token en localStorage
      login(response.token, decoded.role, decoded._id)         

      // Redirigir según el rol con pequeño delay para asegurar que el token se guarde antes de redirigir
      setTimeout(() => {
        navigate(decoded.role === "admin" ? "/admin/home" : "/user/home");
      }, 200);

    }catch (error) {
      console.error("error al registrarse:", error);
      if (error.message === "User already exists") {
      setError("email", { message: "Usuario ya existe" });
      Swal.fire("Usuario existente", "Ya existe una cuenta con este email. Intenta iniciar sesión.", "info");
    } else {
      setError("email", { message: "No se pudo completar el registro" });
      Swal.fire("Error", "Hubo un problema al registrarte. Inténtalo de nuevo más tarde.", "error");
    }
  }
    
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit(onRegister)} className="register-form">
        <h2 >Registro</h2>        
        <label>
          Email
          <input
            type="email"           
            placeholder="Email"
            {...register("email", { required: "Email es obligatorio!", maxLength:50 })}
          />
          {errors.email && <span className="errors">{errors.email.message}</span>}
        </label>  

         <label>
          Nombre Completo
          <input
            type="text"            
            placeholder="Nombre Completo"
            {...register('name',{required:"Nombre Completo es obligatorio!", maxLength: 100})}
          />
          {errors.name && <span className="errors">{errors.name.message}</span>}
        </label>

        <label>
          Contraseña
          <input
            type="password"            
            placeholder="Contraseña"
            {...register('password',{required:"Contraseña es obligatoria!", 
              minLength:{
                value:6,
                message: "Mínimo 6 caracteres"},
              maxLength:{
                value:20,
                message: "Máximo 20 caracteres"}})}
          />
          {errors.password && <span className="errors">{errors.password.message}</span>}
        </label>
       
        <button type="submit">Registrarse</button>

        <div className="register-meta">
          <Link to="/login">¿Ya tienes cuenta? Iniciar sesión</Link>
        </div>
      </form>
    </div>
  );
}
