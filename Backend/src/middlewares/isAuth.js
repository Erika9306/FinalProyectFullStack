const User = require('../../src/api/models/User');
const { verifyToken } = require('../utils/jwt');

//autorización
const isAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({
                message: "Authorization header is not provided"
            });
        }
        //separamos Bearer del token y con .pop() quedamos con la parte después del espacio
        const token = header.split(" ").pop();
        const data = verifyToken(token);
        console.log(data);

        const user = await User.findById(data._id);
        if (!user) {
            return res.status(403).json({ message: "Unauthorized access" });
        }        
        //evitamos mandar la contraseña al Frontend
        const userObj = user.toObject();
        delete userObj.password;

        //guardamos usuario y luego lo pasamos a controladores
        req.user = userObj;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Access denied", error: err.message });
    }
}

module.exports = { isAuth };
