import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generateToken from "../helpers/generateToken.js";

// Crear el esquema para los usuarios
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    token: {
        type: String,
        default: generateToken()
    },
    verified: {
        type: Boolean,
        default: false
    }
});


userSchema.pre('save', async function (next) {
    // Verificar que el password no haya sido hasheado previamente
    if(!this.isModified('password')) {
        next();
    }

    // Hashear el password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Agregar un método para comparar las contraseñas
userSchema.methods.verifyPassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

// Registrar el modelo para los usuarios
const User = mongoose.model('User', userSchema);
export default User;