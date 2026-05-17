import React, {useMemo,useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "./UserHome.css";
import {Button} from '../../Button/Button';
import { AuthContext } from '../../../context/AuthContext';
import { useApi } from '../../../services/api.jsx'; 

export default function UserHome(){  
  const {requestAPI}  = useApi();
  const [movies, setMovies] = useState([]); 
  const[searchMovie, setSearchMovie] = useState('');
  const navigate = useNavigate(); 
  const {token, logout} = useContext(AuthContext);

  useEffect(() => {
    const fetchMovies = async () => {
      // Si no hay token, lo mandamos al login
      if(!token) {
        logout();
        navigate("/login");
        return;
      }
      try {
        const data = await requestAPI('/movies');
        if (data.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        //Si backend devuelve null, por defecto aplicaremos un array vacío [] de películas.
        setMovies(data ?? []);
      } catch (error) {
        console.error("Error al cargar catálogo", error);
      } 
    };
    fetchMovies();
  }, [token, logout, navigate , requestAPI]);


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
        <h2>🎬 Explora nuestro catálogo de películas</h2>  
      </header>

      <div className='search-movie'>
        <input className='search-movie-input'
          type="text"
          placeholder='🔍 Buscar película por su título original'
          value = {searchMovie}
          onChange = {(e) => setSearchMovie(e.target.value)}
        //  Usamos onBlur para limpiar el input después de mostrar los resultados,
        // se activa cuando el input pierda el foco: cuando usario haga click fuera del input o resultados de búsqueda.
          onBlur = {() => {
            setTimeout(() => {
              setSearchMovie('');
            }, 200);
          }}
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