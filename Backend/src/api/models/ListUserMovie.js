const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListShema= new Schema(
    {
        user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        movie: {type: mongoose.Types.ObjectId, ref: "Movie", required:true},
        date: {type: Date, default: Date.now}
        
});

const ListUserMovie = mongoose.model('ListUsermovie', ListShema, 'listUserMovies');
module.exports = ListUserMovie;