const User = require('../api/models/User');

//verificamos si user es aDmin o no

const isAdmin = (role) => async (req,res,next) =>{
    try{
    const user = req.user;
    if(!user){
        return res.status(401).send({message:'User not found'});
    }
    
    const userExists = await User.findById(user._id);
    if(!userExists){
        return res.status(404).send({message:'User not found'});
    }

    if(userExists.role !== role){
        return res.status(403).send({message: 'Unauthorized'});
    }
    next();
    
}catch(error){
    next(error);
}   
}

module.exports = {isAdmin}