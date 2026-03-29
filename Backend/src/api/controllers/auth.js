const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {generateToken} = require('../../utils/jwt');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Category = require('../models/Category');

//Autenticación y la autorización

const login = async (req, res) => {
    try {
    
        const { email, password } = req.body;
        if (!email || !password){
            return res.status(400).json({ message: 'email and password are required' });
        }
        console.log('information received while log in:', email);

        const user = await User.findOne({ email });
        if (!user){
            return res.status(404).json({ message: `user ${email} not found` });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch){
            return res.status(400).json({ message: 'wrong password' });
        }
        const token = generateToken(user);        
        return res.status(200).json({ message: 'Logged in!', token });

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


const allowDeleteUser = async(req,res,next) =>{
    try{
        const user = req.user;
        const {id} = req.params;
        const userDb = await User.findById(user._id);
       
        //para borrar culaquier usuario siendo Admin
        if(userDb.role === "admin"){
            return next();
        }
        //solo puedo borrar su propia cuenta
        if(userDb._id.toString() === id){
            return  next();
        }
        return res.status(403).json({ 
            message: "Not authorized to delete this account" 
        });

    } catch (err) {
        return next(err);
    }
}


const allowAdminMovie = async(req,res,next)=>{
    try{
        const user = req.user;
        const movieId = req.params.id;
        const movieDb = await Movie.findById(movieId);
             if(!movieDb){
                return res.status(404).send({message:'Movie not Found'});
            }
            //para poder borrar cualquier peli
            if(user.role !== 'admin' ){
               return res.status(403).send({message:'Not authorized to take this action'});
            }
           
            next();
        }catch(err){
            next(err);
    }
}

const allowAdminCategory = async(req,res,next)=>{
    try{
        const user = req.user;
        const categoryId = req.params.id;
        const categoryDb = await Category.findById(categoryId);
             if(!categoryDb){
                return res.status(404).send({message:'Category not Found'});
            }
            //para poder borrar cualquier categoria
            if(user.role !== 'admin' ){
               return res.status(403).send({message:'Not authorized to take this action'});
            }
           
            next();
        }catch(err){
            next(err);
    }
}


const allowChangingRole = async(req,res,next)=>{
    try{        
        const {id} = req.params;
        const userRole = req.user;
        const findUser = await User.findById(id);

       if(userRole.role !== 'admin'){
        return res.status(403).json({message: "Not authorized to make changes"});
       }
         if(!findUser){ 
            return res.status(404).json({message: "User not found"});
        }
        next();

    }catch(err){
        next(err);
    }
}

module.exports = {
    login, 
    allowDeleteUser,
    allowAdminMovie,
    allowAdminCategory,
     allowChangingRole
}

