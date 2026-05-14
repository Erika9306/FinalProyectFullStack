
const URL= "https://finalproyectfullstack.onrender.com/api/v1";

export const requesAPI = async (endpoint, method = 'GET', body = null) => {
 //options para la petición fetch para que pueda enviar el token y el body si es necesario
    const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${URL}${endpoint}`, options);
  if (!response.ok){
     throw new Error("Error en la petición");
    }
  
  return await response.json();
};