const router = require('express').Router();
const { postList, getUserList} = require('../../api/controllers/listUserMovie');
const { isAuth } = require('../../middlewares/isAuth');

//lo que está dentro del historial de user en concreto
router.post('/add/:movieId',isAuth, postList);  
 //el historial de peliculas de cada user
router.get('/favourites/:userId', isAuth, getUserList); 

module.exports = router;
