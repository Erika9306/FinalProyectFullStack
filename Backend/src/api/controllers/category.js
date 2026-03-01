const Category = require('../models/Category');

//CRUD categorias

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};


const getCategory= async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};


const postCategory = async (req, res, next) => {
  try {
    
    const cat = req.body;
    console.log("categories received", cat);
    const category = new Category(cat);
    const newCategory = await category.save();
    return res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
};


const putCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};


const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json({ message: 'Category deleted successfully from DB' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategory,
  postCategory,
 putCategory,
  deleteCategory
};
