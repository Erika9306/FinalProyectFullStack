const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({   
    name: String,
    email: {type: String, required: true, unique: true, maxLength: 30, trim: true},
    password: {type: String, required: true, minLength:[3, "Password must have at least 3 characters"], maxLength: 100, trim: true},
    role: {type: String, enum:['admin', 'user'], default: 'user'},
    img: {type: String, default: 'https://us.123rf.com/450wm/get4net/get4net1902/get4net190209043/125446708-anonymous-faceless-user.jpg'},
    movies: [{type: mongoose.Types.ObjectId, ref: 'Movie'}],
          
    },
    {
    timestamps: true,
    }

);

//encriptamos la contraseña del usuario

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    try{
        this.password = await bcrypt.hash(this.password,10);
        next();
    }catch(error){
        next(error);
    }
});
const User = mongoose.model('User', userSchema, 'users');
module.exports = User;