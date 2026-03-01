const cloudinary = require('../../config/cloudinary');
const Movie = require('../models/Movie');
const deleteFile = require('../../utils/deleteFileCloudinary');
const Category = require('../models/Category');

//CRUD películas
const getMovie = async(req,res,next) =>{
    try{
        const {id} = req.params;
        const movie = await Movie.findById(id).populate({
            path: 'category',
            model: Category
        });
        return res.status(200).json(movie);

    }catch(err){
       next(err);        
    }
};

const getMovies = async(req,res,next)=>{
    try{
        const movies = await Movie.find().populate({
            path: 'category',
            model: Category
        });         
        return res.status(200).json(movies);
    }catch(err){
        console.log('Error fetching movies:', err);
       next(err);        
    }
};

const postMovie = async(req,res,next) =>{
    try{
        // Verifica si el archivo llega correctamente
    console.log("File received:", req.file); 
    console.log("Data received:", req.body);
     
    const {title,category, sinopsis, director, year, imgUrl, videoUrl} = req.body;
    
    if(!title|| !category ){
        return res.status(400).json({message: "Title and categories are required"});
    }
 //cuando qiere subir portada de un pelicula desde su ordenador, aunque normalmente será un link de img
    if(req.file){
        image = req.file.path;
    }else if(imgUrl){
        image= imgUrl;
    }else{
        image = null;
    }

    const newMovie = new Movie({
        title,
        sinopsis,
        director,
        year,
        category,
        imgUrl: image,
        videoUrl,
        available: req.body.available  || Date.now()
    });
    
    const savedMovie = await newMovie.save();
    console.log('new movie has been added', savedMovie);
    return res.status(201).json(savedMovie);
    
}catch(err){        
        next(err);       
    }
};


const deleteMovie = async(req,res,next)=>{
    try{
        const {id} = req.params;
        const movie = await Movie.findById(id);
        if(movie.imgUrl){
           deleteFile(movie.imgUrl);
        }
        await Movie.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Movie has been deleted",
            element: movie
        });
    }catch(err){
        next(err);
       
    }
}

const updateMovie = async(req,res,next) => {
    try{
        const {id} = req.params;
        const movie = req.body;
 // la opción new: true nos permitirá ver ya pelicula actualizada
        const movieUpdated = await Movie.findByIdAndUpdate(id , movie, {new: true});
        if (!movieUpdated) {
      return res.status(404).json({ message: 'Movie has been not updated' });
    }
        return res.status(200).json(movieUpdated);
    } catch (error) {
        return next(error);
    }
  }
  
module.exports = {
    getMovie,
    getMovies,
    postMovie,
    deleteMovie,
    updateMovie
    };
