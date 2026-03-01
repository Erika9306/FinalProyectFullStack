import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import "./UserFavourite.css";

export const UserFavourite = () => {    
    const token = localStorage.getItem('token');

    //sacamos usuario decodificando token y alli aparece _id
    const userId = jwtDecode(token)._id;

    //console.log("token decoded, user id", userId);
    const [moviesSaved , setMoviesSaved] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedMovie =async()=>{
            setLoading(true);
            try{
            const response = await fetch(`http://localhost:3000/api/v1/list/favourites/${userId}`,{
                method: "GET",
                headers:{
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if(!response.ok){
                console.log("No se puede extraer películas favoritas", response);
            }

            const result = await response.json();
            console.log("resultado películas favoritas", result);
            setMoviesSaved(result.movies ?? []);
            setLoading(false);           
                
            }catch(error){
                console.log("error al descargar películas favoritas", error);
            }};

            if(userId){
                savedMovie();
            }else{
            setLoading(false);
            }
            },[userId, token]);


            if(loading){
                return <div className='loader'> Cargando tus pelis favoritas </div>
            }

    return (
        <div>
            <h2>Películas Favoritas</h2>
            {moviesSaved.length === 0 ? (
                <div>🍿 No has visto ninguna película!</div>
            ):(
                <table className='favourite-table'>
                    <thead>
                        <tr>
                            <th>Portada</th>
                            <th>Título</th>
                            <th>Vista:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* con () desppues de => en el map hace return automático (implícito),
                        con {} necesitas  añadir return después 
                        */}
                    {moviesSaved.map(m=>(
                        <tr key={m.movie._id} >
                            <td>
                                <img
                                    src={m.movie.imgUrl}
                                    alt={m.movie.title}
                                />
                            </td> 
                            <td>
                                {m.movie.title}
                            </td>                                      
                            <td>
                                {m.date? new Date(m.date).toLocaleDateString(): "Recientemente añadida a favoritas"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
             </table>
            )}            
        </div>
    )
 }
