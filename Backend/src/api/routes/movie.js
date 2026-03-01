const router = require('express').Router();
const {getMovie, getMovies, postMovie, deleteMovie, updateMovie} = require('../../api/controllers/movie');
const { isAuth } = require('../../middlewares/isAuth');
const { upload } = require('../../middlewares/file');
const {allowAdminMovie} = require('../controllers/auth');

const auths = [isAuth, allowAdminMovie];

router.get('/',isAuth, getMovies);
router.get('/:id',isAuth, getMovie);
router.post('/',isAuth, upload.single('imgUrl'), postMovie);
router.delete('/:id',auths, deleteMovie);
router.put('/:id',auths, upload.single('imgUrl'),updateMovie);

module.exports = router;