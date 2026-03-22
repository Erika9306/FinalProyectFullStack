import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {jwtDecode} from "jwt-decode";
import Swal from "sweetalert2";
import "./Login.css";

export default function Login({setRole, setToken}) {
  const URL = "https://finalproyectfullstack.onrender.com";
  const navigate = useNavigate();
  const {
    register,    
       //handleSubmit ya valorará el input y llamará a onSubmit si todo es correcto
       //no hace falta useState con react-hook-form, además hace e.preventDefault()automáticamente
    handleSubmit,
    formState:{ errors }
  } = useForm();
  
  const onLogin = async (data) => {  
    try {

      //mandamos petición al backend mandando la info de usuario
      const response = await fetch(`${URL}/api/v1/user/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(data),
      });

      //si todo correcto, el result es el token genrado en el Backend 
      const result = await response.json();
      console.log("Respuesta Login:", result);

      if (!response.ok) {        
        Swal.fire("Email o contraseña incorrectos");
        return;
      }

      // Decodificar token
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
      console.error("Error durante Login:", error);
      Swal.fire("Error", "Ha ocurrido un error. Inténtalo más tarde.", "error");
      return ;
    }
  };

  return (
    <div className="login-container">    
      <form onSubmit={handleSubmit(onLogin)} className="login-form">
        <h2>Login</h2>
        <label>
          Email
          <input
            type = "email"
            placeholder="Email"
            {...register("email", {required:true, maxLength:50})}
            />
            {errors.email &&<span className="errors-div" >Email es obligatorio</span>}
        </label>

        <label>
          Contraseña
          <input
            type="password"
            placeholder="Contraseña"
            {...register('password', {required:true, maxLength:50})}
            />
            {errors.password && <span className="errors-div" >Contraseña es obligatoria</span>}
        </label>

        <button type="submit">Entrar</button>

        <div className="login-meta">
          <a onClick={()=>navigate("/register")}>¿No tienes cuenta? Crear cuenta</a>
        </div>
      </form>
    </div>
  );
}
