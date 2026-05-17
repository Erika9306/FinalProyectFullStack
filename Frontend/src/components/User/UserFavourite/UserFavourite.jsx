import React, { useEffect, useState , useContext, useCallback} from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from "../../../context/AuthContext.jsx";
import { useApi } from '../../../services/api.jsx'; 
import "./UserFavourite.css";

export const UserFavourite = () => {   
    const {requestAPI} = useApi();
    const {token, userId} = useContext(AuthContext);
    const [moviesSaved , setMoviesSaved] = useState([]);
    const [loading, setLoading] = useState(true);

    const savedMovie =useCallback(async () => {
        setLoading(true);
        try{
            const result= await requestAPI(`/list/favourites/${userId}`, 'GET', null, token);
            console.log("resultado películas vistas", result);
            setMoviesSaved(result.movies ?? []);
            setLoading(false);           
            
        }catch(error){                
            console.log("error al cargar el historial", error);
            Swal.fire("Error", "No se ha podido cargar el historial. Inténtalo más tarde.", "error");
            setLoading(false);
        }
        },[userId, token]);


        useEffect(() => { 
         if(userId){
            savedMovie();
        }else{
        setLoading(false);
        }
    },[userId, savedMovie]);
  
        if(loading){
            return <div className='loader'> Cargando tus pelis favoritas </div>
        }

    return (
        <div>
            <h2>Historial de las Películas vistas</h2>
            {moviesSaved.length === 0 ? (
                <div className='no-views'>🍿 No has visto ninguna película!</div>
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
};
