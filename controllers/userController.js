import User from '../models/User.js';
import Task from '../models/Task.js';
import generateJWT from '../helpers/generateJWT.js';
import generateToken from '../helpers/generateToken.js';
import confirmationEmail from '../helpers/confirmationEmail.js';
import passwordResetEmail from '../helpers/passwordResetEmail.js';

const signUp = async (req, res) => {
    const { name, lastname, email } = req.body;

    // Verificar que el usuario no esté registrado
    const user = await User.findOne({ email });

    if(user) {
        const error = new Error('El correo electrónico ya está registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Registrar al usuario
        const newUser = new User(req.body);
        const registeredUser = await newUser.save();

        // Enviar el e-mail de confirmación
        confirmationEmail({
            name, lastname, email, token: registeredUser.token
        });

        // Retornar como respuesta al usuario registrado
        res.json(registeredUser);
        
    } catch (error) {
        console.log('Error: ', error);
    }
};

const confirmEmail = async (req, res) => {
    // Obtener el token de la URL
    const { token } = req.params;

    // Verificar que el token sea auténtico
    const user = await User.findOne({ token });

    if(!user) {
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Eliminar el token y confirmar la cuenta
        user.token = null; 
        user.verified = true;
        await user.save();

        // Retornar un mensaje de éxito
        res.json({ msg: 'Cuenta confirmada correctamente' });

    } catch (error) {
        console.log('Error: ', error);
    }
};

const logIn = async (req, res) => {
    const { email, password } = req.body;

    // Verificar que el usuario esté registrado
    const user = await User.findOne({ email });

    if(!user) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    // Verificar que la cuenta esté confirmada
    if(!user.verified) {
        const error = new Error('La cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Verificar la contraseña
    if(await user.verifyPassword(password)) {
        //  Generar el JWT y retornar los datos del usuario
        res.json({
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            email: user.email, 
            token: generateJWT(user.id)
        });

    } else {
        const error = new Error('La contraseña es incorrecta');
        return res.status(403).json({ msg: error.message });
    }
};

const account = (req, res) => {
    // Obtener la sesión del usuario en el servidor
    const { user } = req;
    res.json(user);
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Verificar que el usuario esté registrado
    const user = await User.findOne({ email });

    if(!user) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Generar el token para cambiar la contraseña
        user.token = generateToken();
        await user.save();

        // Enviar el e-mail de restablecimiento de contraseña
        passwordResetEmail({
            name: user.name, 
            lastname: user.lastname,
            email, 
            token: user.token
        });

        // Retornar un mensaje de éxito
        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
        
    } catch (error) {
        console.log('Error: ', error);
    }
};

const verifyToken = async (req, res) => {
    const { token } = req.params;

    // Verificar que el token sea auténtico
    const user = await User.findOne({ token });

    if(user) {
        // Retornar un mensaje de éxito
        res.json({ msg: 'Token válido' })

    } else {
        // Retornar un mensaje de error
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Verificar que el token sea auténtico
    const user = await User.findOne({ token });

    if(!user) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Eliminar el token y almacenar la nueva contraseña
        user.token = null;
        user.password = password;
        await user.save();

        // Retornar un mensaje de éxito
        res.json({ msg: 'Contraseña modificada correctamente' });

    } catch (error) {
        console.log('Error: ', error);
    }
};

const updateAccount = async (req, res) => {
    // Obtener los datos del registro
    const user = await User.findById(req.params.id);

    // Verificar si se pudieron obtener los datos
    if(!user) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    // Verificar que el correo electrónico no esté previamente registrado
    const { email } = req.body;

    if(user.email !== req.body.email) {
        const registeredEmail = await User.findOne({ email });

        if(registeredEmail) {
            const error = new Error('El correo electrónico ya está registrado');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        // Actualizar la información del registro
        user.name = req.body.name;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        
        // Almacenar el registro actualizado
        const updatedUser = await user.save();
        res.json(updatedUser);
        
    } catch (error) {
        console.log('Error: ', error);
    }
};

const changePassword = async (req, res) => {
    // Obtener los datos
    const { id } = req.user;
    const { current_pwd, new_pwd } = req.body;

    // Verificar que el usuario esté registrado
    const user = await User.findById(id);

    if(!user) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    // Verificar que la contraseña sea correcta
    if(await user.verifyPassword(current_pwd)) {
        // Actualizar la contraseña
        user.password = new_pwd;

        // Almacenar el registro actualizado
        await user.save();

        // Retornar un mensaje de éxito
        res.json({ msg: 'Contraseña Modificada Correctamente' });

    } else {
        const error = new Error('La contraseña es incorrecta');
        return res.status(400).json({ msg: error.message });
    }
};

const deleteAccount = async (req, res) => {
    const { id } = req.params;

    // Verificar que el id sea auténtico
    const user = await User.findById(id);

    if(!user) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    try {
        // Eliminar las tareas del usuario
        await Task.deleteMany({ user: user._id });

        // Eliminar al usuario
        await user.deleteOne();

        // Retornar una respuesta de éxito
        res.json({ msg: 'Cuenta Eliminada' });

    } catch (error) {
        console.log('Error: ', error);
    }
};

export {
    signUp, 
    logIn, 
    confirmEmail, 
    account, 
    forgotPassword, 
    verifyToken, 
    resetPassword, 
    updateAccount, 
    changePassword, 
    deleteAccount
}