import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyAuth = async (req, res, next) => {
    let token;

    // Verificar que el token haya sido enviado
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Asignar el token a la variable
            token = req.headers.authorization.split(' ')[1];

            // Decodificar la información del token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Crear una sesión en el servidor con los datos del usuario (si existe)
            req.user = await User.findById(decoded.id).select(
                '-password -token -verified -__v'
            );
            
            return next();

        } catch (error) {
            const e = new Error('Token no válido');
            return res.status(403).json({ msg: e.message });
        }
    } 

    // Si el token no fue enviado retornar un mensaje de error
    if(!token) {
        const error = new Error('Token inexistente');
        return res.status(403).json({ msg: error.message });
    }
    
    next();
};

export default verifyAuth;