import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {jwtDecode} from "jwt-decode";
import "./Register.css";

export default function Register({setToken, setRole}) {
  const URL = "https://finalproyectfullstack.onrender.com";
  const navigate = useNavigate();
  //React Form Hook
  const {register,handleSubmit,formState :{errors}} = useForm();

  const onRegister = async (data)=>{
    try {
      const response = await fetch(`${URL}/api/v1/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Respuesta de registro:", result);

      if (!response.ok) {
        console.log("error al registrarse", result);
        return;
      }
      if(response.ok){
        localStorage.setItem("token",result.token);           
      }
      const decoded = jwtDecode(result.token);

      // Guardar token en localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("userId", decoded._id);
      setToken(result.token);
      setRole(decoded.role);          

      // Redirigir según el rol
    navigate(decoded.role === "admin" ? "/admin/home" : "/user/home");

    } catch (error) {
      console.error("erroar al registrarse:", error);
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
            {...register("email", { required: true, maxLength:50 })}
          />
          {errors.email && <span className="errors">Email es obligatorio</span>}
        </label>  

         <label>
          Nombre Completo
          <input
            type="string"            
            placeholder="Nombre Completo"
            {...register('name',{required:true, maxLength: 100})}
          />
          {errors.name && <span className="errors">Nombre Completo es obligatorio</span>}
        </label>

        <label>
          Contraseña
          <input
            type="password"            
            placeholder="Contraseña"
            {...register('password',{required:true, minLength:6, maxLength: 20})}
          />
          {errors.password && <span className="errors">Contraseña es obligatoria</span>}
        </label>

        <button type="submit">Registrarse</button>

        <div className="register-meta">
          <a onClick={()=> navigate("/login")}>¿Ya tienes cuenta? </a>
        </div>
      </form>
    </div>
  );
}
