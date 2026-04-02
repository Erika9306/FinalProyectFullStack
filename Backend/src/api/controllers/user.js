const User = require('../models/User');
const fileDelete = require('../../utils/deleteFileCloudinary.js');
const {generateToken} = require('../../utils/jwt');
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
            //foto por defecto, luego en su perfil puede cambiarla
            img: 'https://us.123rf.com/450wm/get4net/get4net1902/get4net190209043/125446708-anonymous-faceless-user.jpg',          
            movies: req.body.movies            
        });
                
        const createdUser = await newUser.save();
        const token = generateToken(createdUser);        
        return res.status(201).json({ message: 'Created! passing through auto-login', token });

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
        console.log("Datos recibidos para actualización:", req.body);
    const {id} = req.params;
    const {name, password,role} = req.body;
    const user = await User.findById(id);
   
    if(name){
        user.name = name;
    }
    if(role){
        user.role = role;
    }
    if (req.file) {
    user.img = req.file.path;
    console.log("Imagen actualizada con nueva subida:", req.file.path);
// } else if (req.body.img) {
//     user.img = req.body.img;
//     console.log("Imagen actualizada con URL proporcionada:", req.body.img);
}
    if(password && password !== ''){
        user.password = password;
    }
    
    await user.save();
    return res.status(200).json(user);
    }catch(error){
       return next(error);
    }
}

module.exports = {getUser, getUsers, postUser, deleteUser, updateUser};