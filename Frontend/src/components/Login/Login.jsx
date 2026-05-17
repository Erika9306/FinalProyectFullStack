import React, {useContext} from "react";
import { useNavigate, Link} from "react-router-dom";
import { useForm } from "react-hook-form";
import {jwtDecode} from "jwt-decode";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useApi } from '../../services/api.jsx'; 
import "./Login.css";

export default function Login() {
  const {requestAPI} = useApi();
  const {login} = useContext(AuthContext); 
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
      const result = await requestAPI('/user/login', 'POST', data);
      console.log("Respuesta Login:", result);
     
      const decoded = jwtDecode(result.token);

      // usamos login definido en el contexto para guardar el token y el rol en el estado global y localStorage
      login(result.token, decoded.role, decoded._id);           

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
            className="password"
            {...register('password', {required:true, maxLength:50})}
            />
            {errors.password && <span className="errors-div" >Contraseña es obligatoria</span>}
        </label>

        <button type="submit">Entrar</button>

        <div className="login-meta">
          <Link to ="/register">¿No tienes cuenta? Crear cuenta</Link>
        </div>
      </form>
    </div>
  );
}
