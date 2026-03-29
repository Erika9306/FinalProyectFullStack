import React, {useMemo,useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./UserHome.css";
import {Button} from '../../Button/Button'

export default function UserHome(){
  const URL = "https://finalproyectfullstack.onrender.com";
  const [movies, setMovies] = useState([]); 
  const[searchMovie, setSearchMovie] = useState('');
  const navigate = useNavigate();
 

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem("token");

      // Si no hay token, lo mandamos al login
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${URL}/api/v1/movies`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        const data= await res.json();
       
        //Si backend devuelve null, por defecto aplicaremos un array vacío [] de películas.
        setMovies(data ?? []);
      } catch (error) {
        console.error("Error al cargar catálogo", error);
      } 
    };
    fetchMovies();
  }, [navigate]);


  const search = useMemo(()=>{
    const inputMovie = searchMovie.toLowerCase().trim();
    if(!inputMovie){
      return [];
    }
    console.log('Buscando película', inputMovie,searchMovie);
    return movies.filter(m=> m.title.toLowerCase().trim().includes(inputMovie));
    
  },[ movies, searchMovie]);
  

  return (
    <div className="user-home">      
      <header className="user-header">
        <h1>🎬 Explora nuestro catálogo de películas</h1>  
      </header>

      <div className='search-movie'>
        <input className='search-movie-input'
          type="text"
          placeholder='🔍 Buscar película por su título original'
          value = {searchMovie}
          onChange = {(e) => setSearchMovie(e.target.value)}
        />
        {searchMovie !== '' && (
          <div className='search-result-div'>
            {search.length === 0 ? (
              <p>No se encontró ningúna película "{searchMovie}"</p>
            ) : (
              <div className="results-list" >
                {search.map(s => (
                  <div key={s._id}>
                    <div className="search-item">
                      <img src ={s.imgUrl} alt ={s.title}/>
                      {s.title}

                      <Button 
                        text={"Ver Ahora"}
                        onClick={() => navigate(`/user/movie/${s._id}`)}
                        className={'button-danger'}
                      />                  
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
     
      <div className="movie-grid">
        {movies.map(movie => (
            <div key={movie._id} className="movie-card">
              <img src={movie.imgUrl} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <span className="badge">{movie.category?.title ?? 'General'}</span>
                <Button 
                  text={"Ver Ahora"}
                  onClick={() => navigate(`/user/movie/${movie._id}`)}
                  className={'button-danger '}
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}