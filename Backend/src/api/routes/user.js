const router = require('express').Router();
const {login, allowDeleteUser} = require('../controllers/auth');
const {isAuth} = require('../../middlewares/isAuth');
const {getUser, getUsers, postUser, deleteUser, updateUser} = require ('../../api/controllers/user');
const { isAdmin } = require('../../middlewares/isAdmin');
const { upload } = require('../../middlewares/file');

const auths = [isAuth, allowDeleteUser];

router.post("/login", login);
router.get("/:id", isAuth,getUser);
router.get("/", isAuth, getUsers);
router.post("/register", upload.single('img'), postUser);
router.put("/:id", isAuth, upload.single('img'), updateUser);
router.delete("/:id", auths, deleteUser);

module.exports = router;

