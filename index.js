import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";

const app = express();

// Especificar cómo se leerán los datos
app.use(express.json());

// Buscar el archivo .env
dotenv.config();

// Realizar la conexión a la base de datos
connectToDB();

// Indicar qué dominios tienen permitido usar la API
const allowedDomains = [ process.env.FRONTEND_URL ];

// Configurar CORS
const corsOptions = {
    origin: function(origin, callback) {
        if(allowedDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Acceso no permitido por CORS'));
        }
    }
};

// Aplicar la configuración de CORS
app.use(cors(corsOptions));

// Asignar el puerto
const PORT = process.env.PORT || 4000;

// Registrar el routing de la API
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en: port ${PORT}`);
});

