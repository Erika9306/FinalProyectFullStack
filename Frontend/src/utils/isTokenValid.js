import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token) => {
  if (!token) return false;
  try{
    const decode = jwtDecode(token);

    //revisamos si el token está expirado
    var today = Date.now() / 1000; 
    if(today > decode.exp){        
      return false;
    }
    
    //si token es válido
    return true;
  } catch (error){
    console.log('error al decodificar token', error);
    return false;
  }
  };