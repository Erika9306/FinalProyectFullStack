import React, { useEffect, useState , useContext} from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from "../../../context/AuthContext.jsx";
import { requesAPI } from '../../../services/api.js';
import "./UserFavourite.css";

export const UserFavourite = () => {   

    const {token, userId} = useContext(AuthContext);
    const [moviesSaved , setMoviesSaved] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedMovie =async()=>{
            setLoading(true);
            try{
                const result= await requesAPI(`/list/favourites/${userId}`, 'GET', null, token);
                console.log("resultado películas vistas", result);
                setMoviesSaved(result.movies ?? []);
                setLoading(false);           
                
            }catch(error){                
                console.log("error al cargar el historial", error);
                Swal.fire("Error", "No se ha podido cargar el historial. Inténtalo más tarde.", "error");
                setLoading(false);
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
            <h2>Historial de las Películas vistas</h2>
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
