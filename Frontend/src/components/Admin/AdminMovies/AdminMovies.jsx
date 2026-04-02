import React, { useMemo,useCallback, useEffect, useState, use } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import "./AdminMovies.css";
import { Button } from '../../../components/Button/Button';


//usamos React.memo para memorizar el componente y evitar renders innecesarios
export const AdminMovies = React.memo(() => {
  const URL = "https://finalproyectfullstack.onrender.com";
  const [movies, setMovies] = useState([]);
  const [addMoviesForm, setAddMoviesForm] = useState(false);
  const [editMovieForm, setEditMovieForm] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchMovie, setSearchMovie] = useState('');
  
  const {register, handleSubmit, reset, formState:{errors}} = useForm();


  useEffect(() => {
    const listMovies = async () => {
      try{
      const res = await fetch(`${URL}/api/v1/movies`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();      
      setMovies(data || []);

    }catch(error){
      console.log('No se puede cargar lista de peliculas', error);
    }
    };

    listMovies();
  }, []);

  //usamos useEffect para sacar las categorias ya que ellas no van a cambiar
useEffect(()=>{
  const categoriesList = async ()=>{
    try{
    const result = await fetch(`${URL}/api/v1/categories`, {
      method: "GET",
      headers:{
        "Authorization" : `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"  
       }
      });
      const data = await result.json();

      //setCategories guardamos los datosy luego en el formulario
      //usamos categories para dibujarlos
      setCategories(data);
  }catch(error){
    console.log("No se pudo cargar categorias", error);
  }
    };
categoriesList();
},[]);


 //CREAR PELÍCULA
// usamos useCallback para memorizar la función y así se renderiza una sola vez

 const createMovie = useCallback(async (data)=>{
  try{
  setSearchMovie('');
  const response = await fetch(`${URL}/api/v1/movies`, {
    method: "POST",
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      },      
    );
    const result = await response.json();    
    console.log('Movies', result);

    if(!response.ok){
      console.log('Error en crear movies');
      Swal.fire("Error", "Error al crear la película", "error");
      return;
    }
    const movieCat = categories.find(c => c._id === data.category); 

    //copiamos lo que no cambio y asignamos al category valores de movieCat
    const mCategory = {...result, category: movieCat};

    //añadimos la película a la lista de las pelis con SetMovies, asi no tenemos que añadir dependecia

    setMovies(prev => [...prev, mCategory]);
    Swal.fire("Ëxito!", "Película agregada al catálogo!", "success");
    setAddMoviesForm(false);
    reset();

  }catch(error){
    console.log("Error creando película", error);
    Swal.fire("Error",'Upss... Algo va mal, intenta de nuevo más tarde',"error");
  }
 },[categories, reset]);

   //EDITAR PELÍCULA
const retrieveMovieInfo = useCallback((movie) =>{
  setSearchMovie('');
  setEditMovie(movie);
  setEditMovieForm(true);
},[]);

  const handleEdit = useCallback(async (e) => {
    e.preventDefault();
    if(!editMovie){
      return;
    }

    try{
      const response = await fetch(`${URL}/api/v1/movies/${editMovie._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editMovie)
    });

    if(!response.ok){
      console.log("Error al editar película")
    }
    const categoryId = editMovie.category?._id || editMovie.category;
    console.log('Category ID:', categoryId, typeof categoryId);
    const categoria = categories.find(c=> String(c._id) === String(categoryId));
    //si cateogria cambio ,entocnes la inyectamso como el cambio de la info de pelis
    const updateMovie ={
      ...editMovie, 
      category: categoria || { title: "Sin categoría"}
    };

    setMovies(prev => prev.map(m => m._id === editMovie._id? updateMovie : m));
    setEditMovieForm(false);

    Swal.fire("Actualizada", "Película actualizada correctamente", "success");
  }catch(error){
    console.log(error);
     Swal.fire("Error", "Error al editar la peli", "error");
     return;
  }
  }, [editMovie,categories]);

  //Detalle
  //no hace falta hacer fetch ya que toda la info tenemos el estado
  const detailsMovies = useCallback(async(movie)=>{
     setSearchMovie('');
    Swal.fire({
    title: `<strong>${movie.title}</strong>`,
    html: `
      <div style="text-align: left; color: black;">
        <img src="${movie.imgUrl}" alt="${movie.title}" style="width: 80%; border-radius: 10px; margin-bottom: 15px;">
        <p style="color: #333333;"><strong>Categoría:</strong> ${movie.category?.title}</p>        
        <p style="color: #333333;"><strong>Director:</strong> ${movie.director}</p>
        <p style="color: #333333;"><strong>Año:</strong> ${movie.year}</p>
        <p style="color: #333333;"><strong>Sinopsis:</strong> ${movie.sinopsis}</p>
        <p style="color: #333333;"><strong>Disponible desde:</strong> ${new Date(movie.available).toLocaleDateString()}</p>
      </div>
    `,
    showCloseButton: true,
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#ff0202',
  });
}, []);

//Borrar
const deleteMovie = useCallback(async(movie)=>{ 
  try{
  setSearchMovie('');
  const result = await Swal.fire({
      title: `¿Estás seguro que quieres eliminar ${movie.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#ff0202',
     
    });
    
    if(!result.isConfirmed){
      return;
    }
  const response = await fetch(`${URL}/api/v1/movies/${movie._id}`,{
    method:"DELETE",
    headers:{
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json"
    }
  });

  if(response.ok){
    setMovies(prev => prev.filter(p => p._id !== movie._id));
     Swal.fire('Eliminada', `La película ${movie.title} ha sido eliminada correctamente`, 'success');
    }
  }catch(error){
    console.log("Error al borrar pelicula",error);
  }
},[]);

const search = useMemo(()=>{
  const inputMovie = searchMovie.toLowerCase().trim();
  if(!inputMovie){
    return [];
  }
  console.log('Buscando película', inputMovie,searchMovie);
  return movies.filter(m=> m.title.toLowerCase().trim().includes(inputMovie));
  
},[ movies, searchMovie]);

  


  return (
    <div className='movies-table'>
    <h2> 🎬 Películas</h2>
     <h3>Total: {movies.length} películas en el catálogo</h3>
     <div className='search-movie'>
        <input className='search-movie-input'
        type="text"
        placeholder='🔍 Buscar pelicula según título'
        value = {searchMovie}
        onChange = {(e) => setSearchMovie(e.target.value)}
        />

     {searchMovie !== '' && (
    <div className='search-result-div'>
      {search.length === 0 ? (
        <p>No se encontró ninguna película "{searchMovie}"</p>
      ) : (
        <div className="results-list">
          {search.map(s => (            
              <div key={s._id}>
            <div className="search-item-row">
               <img src ={s.imgUrl} alt ={s.title}/>
               {s.title} 

              <Button 
              text="👁️ Detalle"
              onClick={()=> detailsMovies(s)}
              className="button-primary"
              />
              <Button 
              text="✏️ Editar"
              onClick={()=> retrieveMovieInfo(s)}
              className="button-secondary"        
              />
              <Button 
              text="🗑️ Borrar"
              onClick={()=> deleteMovie(s)}
              className="button-danger"
              />            
             </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>
      {!addMoviesForm &&
        <Button
        text={"➕ Añadir Película"}
        onClick={() => setAddMoviesForm(true)}
        className={"button-primary add-movie-button"}
        />
      }
      {
        addMoviesForm &&(
          <form onSubmit ={handleSubmit(createMovie)} className='create-movie-form'>
            <h3>➕ Añadir Película</h3>
          <input
            type="text"
            placeholder="Título"
            {...register ('title', {required: true, maxLength: 100})}
           />
          <textarea
            placeholder="Sinopsis"
            {...register('sinopsis', {required:true, maxLength:500})}
          />
          <input
            type="text"
            id="director"
            placeholder="Director"
            {...register('director', {required: true, maxLength:50})}
           />
          <input 
          type="text"
           placeholder="Año del lanzamiento"
           {...register('year', {required:true, maxLength:4 })}
           />
        <select 
          {...register('category', {required:true})} >
          <option value = ""> Elige categoría de la película</option>          
            {categories.map((cat) =>{
              return(
                <option
                  key={cat._id}
                  value={cat._id} >
                    {cat.title}
                  </option>
              );
            })}
        </select>
        <input 
          type="text"
          placeholder="URL de la portada"
          {...register('imgUrl', {required:true})}
        />
        <input 
          type="text"
          placeholder="URL del video"
          {...register('videoUrl', {required:true})}
        />
        <input 
        type="date"
         placeholder="Disponible desde"
         {...register('available', {required:true})}
         />         
        {errors.title && <span className='errors'>Título es obligatorio</span>  }
        {errors.sinopsis && <span className='errors'>Sinopsis es obligatorio</span>  }
        {errors.director && <span className='errors'>Director es obligatorio</span>  }
        {errors.year && <span className='errors'>Año del lanzamiento es obligatorio</span>}
        {errors.category && <span className='errors'>Categoría es obligatoria</span>}
        {errors.imgUrl && <span className='errors'>La portada es obligatoria</span>}
        {errors.available && <span className='errors'>Fecha desde cuando se puede ver obligatoria</span>}

       <div className='form-btn'>
        <Button
        type="submit"
        text={"Guardar"}
        className={"button-secondary"}
        />
        <Button
        text={"Cancelar"}
        type="button"
        onClick ={() => {
          setAddMoviesForm(false);          
        }}
        className={"button-danger"}
        />
        </div>
      </form>
)}

{editMovieForm && editMovie &&(
  <form onSubmit={handleEdit} className='edit-movie-form'>
     <h3>✏️ Editar Película</h3> 
    <input 
      type='text'
      placeholder='Título'
      value={editMovie.title}
      onChange={e => setEditMovie({...editMovie, title: e.target.value})} 
    />
    <textarea
      placeholder='Sinopsis'
      value={editMovie.sinopsis}
      onChange={e => setEditMovie({...editMovie, sinopsis: e.target.value})} 
    />
    <input 
      type="text"
      placeholder="Año del lanzamiento"
      value = {editMovie.year}
      onChange ={ e=> setEditMovie({...editMovie, year: e.target.value})}  
    />
    <input 
      type="text"
      placeholder="Director"
      value = {editMovie.director}
      onChange ={ e=> setEditMovie({...editMovie, director: e.target.value})}  
    />
    <select   
      value={editMovie.category}
      onChange={e => setEditMovie({...editMovie, category: e.target.value})}>
      <option value = ''> Selecciona una categoría</option>
      {categories.map(cat => {
        return(
          <option 
          key= {cat._id}
          value= {cat._id}
          >
            {cat.title}
          </option>

        )
      })}
    </select>   
    
        <input 
          type="text"
          placeholder="URL de la portada"
          value = {editMovie.imgUrl}
          onChange ={ e =>setEditMovie({...editMovie, imgUrl: e.target.value})}
        />
        <input 
          type="text"
          placeholder="URL del video"
          value = {editMovie.videoUrl}
          onChange ={ e =>setEditMovie({...editMovie, videoUrl: e.target.value})}
        />
        <input 
        type="date"
         placeholder="Disponible desde"
         value = {editMovie.available}
         onChange = {e=> setEditMovie({...editMovie, available: e.target.value})}
         />     

    <div className='form-btn'>
      <Button
        type="submit"
        text={"Guardar"}
        className={"button-secondary"}
      />
      <Button
        text={"Cancelar"}
        type="button"
        onClick={() => {
          setEditMovieForm(false);
        reset();
        }}
        className={"button-danger"}
      />
    </div>
  </form>
)}



      <table>
        <thead>
          <tr>
            
            <th>Imagen</th>
            <th>Título</th>
            <th>Categoría</th>            
            <th>Acciones</th>

          </tr>
        </thead>

        <tbody>
          {movies.map(m => (
            <tr key={m._id}>              
              <td>
                <img src={m.imgUrl} alt = {m.title} width="50" height="75" />
                
              </td>
              <td>{m.title}</td>  
              <td>{m.category.title || "Sin categoría"}</td>            
             
              <td className='actions'>
                <Button 
                text={"👁️ Detalle"}
                onClick={()=> detailsMovies(m)}
                className={"button-primary"}
                />
                <Button 
                text={"✏️ Editar"}
                onClick={()=> retrieveMovieInfo(m)}
                className={"button-secondary"}
                />
                <Button 
                text={"🗑️ Borrar"}
                onClick={()=> deleteMovie(m)}
                className={"button-danger"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});