import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserFavourite } from '../UserFavourite/UserFavourite';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import './MovieDetail.css'


export default function MovieDetail() { 
  const [movie, setMovie] = useState(null);
  const [selected, setSelected] = useState(false);

  //para buscar el id de la pelicula tenemos que buscarlo por parametros  useParams()dentro de URL
  //movie._id aquí no va funcionar ya que no es backend
  const {id} = useParams();

  useEffect(() => {
    const movieSelected = async()=>{
      const response = await fetch(`http://localhost:3000/api/v1/movies/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
          }
        });
      const result = await response.json();
      //console.log(result);
      setMovie(result);
    };
    movieSelected(id);
    },[id]);

    
  const favouriteMovie = useCallback(async()=>{
    const token = localStorage.getItem('token');

  //sacamos usuario decodificando token y alli aparece _id
  const userId = jwtDecode(token)._id;
  const response = await fetch(`http://localhost:3000/api/v1/list/add/${id}`,{
    method: "POST",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userId: userId})      
    });

    if (response.ok) {
      setSelected(true);
      Swal.fire("¡Guardada!", "Película añadida al ❤️", "success");
    } else {
      Swal.fire("Error", "No se pudo guardar, intenta más tarde", "error");
  }

  },[id]);

    if(!movie){
      return <div >Cargando película...</div>;
    }

    return (
      <div className='movie-detail-div'>    
        <h1>{movie.title}</h1>
        <button  className="favourite-button" onClick={()=> favouriteMovie()}>
          {selected? '❤️' : '🤍'}
        </button>
        <div>
          <img
            src={movie.imgUrl}
            alt={movie.title}            
          />
        </div>
        <div className='movie-description-div'>
          <p><strong>Sinopsis:</strong> {movie.sinopsis ?? "No hay sinopsis"}</p>        
          <p><strong>Categoría:</strong> {movie.category?.title ?? "No pertenece a ninguna categoría"}</p>
        </div>
        
        {/* Video */}
        <div className='movie-reproduction-div'>
          {movie.videoUrl ? (
            <iframe            
              src={movie.videoUrl}   
              //allow fullscreen dejará que el video se pueda ver en toda la pantalla        
              allowFullScreen
            >
            </iframe>
          ) : (
            <div>
              ⚠️ Película no disponible.
            </div>
          )}
        </div>        
      </div>
    );
  }
