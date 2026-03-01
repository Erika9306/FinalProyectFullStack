const router = require('express').Router();
const { getCategories, getCategory, postCategory, putCategory, deleteCategory } = require('../../api/controllers/category');
const { isAuth } = require('../../middlewares/isAuth');
const { isAdmin } = require('../../middlewares/isAdmin'); 
const { allowAdminCategory } = require('../controllers/auth');

const auths = [isAuth,allowAdminCategory];

router.get('/', isAuth, getCategories);       
router.get('/:id', isAuth, getCategory); 
router.post('/', isAuth, isAdmin('admin'), postCategory);
router.put('/:id', auths, putCategory);
router.delete('/:id', auths, deleteCategory); 

module.exports = router;
