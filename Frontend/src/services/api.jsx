import React, { useContext} from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const URL= "https://finalproyectfullstack.onrender.com/api/v1";

export const useApi = () => {
  const { token} = useContext(AuthContext);

  const requestAPI = async (endpoint, method = 'GET', body = null) => {
  
 //options para la petición fetch para que pueda enviar el token y el body si es necesario
    const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token || localStorage.getItem("token")}`
    }
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${URL}${endpoint}`, options);
  if (!response.ok){
     throw new Error("Error en la petición requestAPI: " + response);
    }
  
  return await response.json();
};
return { requestAPI }
};