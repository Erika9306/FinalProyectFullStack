const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('./Category');

const movieSchema = new Schema(
    {  
       title : String,
       sinopsis: String,
       director: String,
       year: String,
       category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
       imgUrl: String,       
       videoUrl: String,
       available: {type: Date},

 });


const Movie= mongoose.model('Movie', movieSchema, 'movies');
module.exports = Movie;