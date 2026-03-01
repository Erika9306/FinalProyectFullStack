const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = Schema({
    id: String,
    title: String,
    description: String
});

const Category = mongoose.model('Category', categorySchema, 'categories');
module.exports = Category;