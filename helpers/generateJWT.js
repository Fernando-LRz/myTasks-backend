import jwt from 'jsonwebtoken';

// Generar un jwt que almacene el id del usuario
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export default generateJWT;