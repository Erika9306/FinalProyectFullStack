import React from "react";
import { useNavigate } from "react-router-dom";
import {  useForm } from "react-hook-form";
import {jwtDecode} from "jwt-decode";
import Swal from "sweetalert2";
import "./Register.css";


export default function Register({setToken, setRole}) {
  const URL = "https://finalproyectfullstack.onrender.com";
  const navigate = useNavigate();
  //React Form Hook
  const {register,
    handleSubmit,
    setError,
    formState :{errors}} = useForm();

  const onRegister = async (data)=>{
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if(data.imgFile && data.imgFile.length > 0){
        formData.append("img", data.imgFile[0]);
      }
      //si usuario sube imagen, se envía como FormData, si no, se envía como JSON sin el campo img, para que el backend mantenga la url antigua
      else{
        formData.append("img", data.imgUrl);
      }
      const response = await fetch(`${URL}/api/v1/user/register`, {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      console.log("Respuesta de registro:", result);

      if (!response.ok) {
        setError("email", { message: result.message || "Error al registrarse" });
        Swal.fire(result.message || "Error al registrarse");
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

      // Redirigir según el rol con peuqe;ño delay para asegurar que el token se guarde antes de redirigir
      setTimeout(() => {
        navigate(decoded.role === "admin" ? "/admin/home" : "/user/home");
      }, 200);

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
            {...register("email", { required: "Email es obligatorio!", maxLength:50 })}
          />
          {errors.email && <span className="errors">{errors.email.message}</span>}
        </label>  

         <label>
          Nombre Completo
          <input
            type="string"            
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
            {...register('password',{required:"Contraseña es obligatoria!", minLength:6, maxLength: 20})}
          />
          {errors.password && <span className="errors">{errors.password.message}</span>}
        </label>
        <label>
          Foto de perfil (opcional)
          <input
            type="file"
            accept="image/*"
            {...register('imgFile')}
          />
        </label>

        <button type="submit">Registrarse</button>

        <div className="register-meta">
          <a onClick={()=> navigate("/login")}>¿Ya tienes cuenta? </a>
        </div>
      </form>
    </div>
  );
}
