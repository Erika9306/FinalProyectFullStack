const ListUserMovie = require('../models/ListUserMovie');
const User = require('../models/User');
const Movie = require('../models/Movie');


//creamos o acualizamos la lista de películas que usuario vio
const postList = async (req, res, next) => {
  try {
    //sacamos usuario id que viene de middleware isAuth
    const userId = req.user._id;
    const {movieId} = req.params;
   
    const user = await User.findById(userId);
    const movie = await Movie.findById(movieId);

    if (!user || !movie) {
      return res.status(404).json({ message: 'User or Movie not found' });
    }
    
    const list = await ListUserMovie.findOneAndUpdate({
      //lo que busca
      user: userId, movie: movieId
    },
    //lo que actualiza/guarda
    {user: userId, movie: movieId},
  {
    //update+ insert, si existe lo acutalzia y si no, lo crea
    upsert: true,
    new:true
  })
  return res.status(200).json({
    message: "Favourites updated succsessfully",
    movies: list
  });
  
  } catch (err) {
    next(err);
  }
};


// Obtener lista de un usuario específico
const getUserList = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const lists = await ListUserMovie.find({ user: userId })
       .populate('movie', 'title imgUrl');
    if(lists.length === 0){
      return res.status(200).json({message: "No se ha encontrado ninguna película favorita", movies: []})
    }
    return res.status(200).json({movies: lists, total: lists.length});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postList, 
  getUserList,
};