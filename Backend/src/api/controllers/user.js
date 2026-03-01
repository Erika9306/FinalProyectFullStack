const User = require('../models/User');
const fileDelete = require('../../utils/deleteFileCloudinary.js');

//CRUD usuarios

const getUser = async (req, res,next)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        return res.status(200).json(user);
        
    }catch(err){
        return next(err);
    }
}
const getUsers =async (req, res, next) =>{
    try{
        const users = await User.find();
        return res.status(200).json(users);

    }catch(error){
       return next(error);
    }
}

const postUser = async (req, res,next) => {
    try{

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,  
            img: req.body.img,          
            movies: req.body.movies            
        });
                
        const createdUser = await newUser.save();
        return res.status(201).json(createdUser);

    }catch(err){
       return next(err);
    }

}

const deleteUser = async (req, res,next) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);      
       if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
        if(user.img){
            try{

                await fileDelete(user.img);
            }catch(error){
                console.log("Error at deleting image from Cloudinary", error);
                
            }
        }
        await User.findByIdAndDelete(id);
        return res.status(200).json({message: "User has been deleted"});
        
    }catch(err){
         return next(err);
    }
}

const updateUser = async (req, res,next) => {
    try{
    const {id} = req.params;
    const {img, name, password} = req.body;
    const user = await User.findById(id);
    if(name){
        user.name = name;
    }
    if(img){
        user.img = img;
    }
    if(password){
        user.password = password;
    }
    await user.save();
    return res.status(200).json(user);

    }catch(error){
        return next(error);
    }
}

module.exports = {getUser, getUsers, postUser, deleteUser, updateUser};