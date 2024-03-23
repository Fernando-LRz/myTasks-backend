import Task from '../models/Task.js';

const addTask = async (req, res) => {
    // Crear la tarea y asociarla a su creador
    const task = new Task(req.body);
    task.user = req.user._id;

    try {
        // Registrar la tarea
        const registeredTask = await task.save();

        // Retornar como respuesta la tarea registrada
        res.json(registeredTask);

    } catch (error) {
        console.log('Error: ', error);
    }
};

const getTasks = async (req, res) => {
    // Obtener las tareas del usuario
    const tasks = await Task.find().where('user').equals(req.user);

    // Retornar como respuesta las tareas obtenidas
    res.json(tasks);
};

const getTask = async (req, res) => {
    const { id } = req.params;

    // Verificar que el id sea auténtico
    const task = await Task.findById(id);

    if(!task) {
        return res.status(404).json({ msg: 'Tarea no encontrada' });
    }
    
    // Verificar que la tarea pertenezca al usuario
    if(task.user._id.toString() !== req.user._id.toString()) {
        return res.json({ msg: 'Acción no permitida' });
    }

    // Retornar como respuesta la tarea solicitada
    res.json(task);
};

const updateTask = async (req, res) => {
    const { id } = req.params;

    // Verificar que el id sea auténtico
    const task = await Task.findById(id);

    if(!task) {
        return res.status(404).json({ msg: 'Tarea no encontrada' });
    }
    
    // Verificar que la tarea pertenezca al usuario
    if(task.user._id.toString() !== req.user._id.toString()) {
        return res.json({ msg: 'Acción no permitida' });
    }

    // Actualizar la tarea
    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.date = req.body.date || task.date;
    task.time = req.body.time || task.time;

    try {
        const updatedTask = await task.save();
        res.json(updatedTask);

    } catch (error) {
        console.log('Error: ', error);   
    }
};

const setFavorite = async (req, res) => {
    const { id } = req.params;

    // Verificar que el id sea auténtico
    const task = await Task.findById(id);

    if(!task) {
        return res.status(404).json({ msg: 'Tarea no encontrada' });
    }
    
    // Verificar que la tarea pertenezca al usuario
    if(task.user._id.toString() !== req.user._id.toString()) {
        return res.json({ msg: 'Acción no permitida' });
    }

    // Actualizar la tarea
    task.favorite = !task.favorite;

    try {
        const updatedTask = await task.save();
        res.json(updatedTask);

    } catch (error) {
        console.log('Error: ', error);
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    // Verificar que el id sea auténtico
    const task = await Task.findById(id);

    if(!task) {
        return res.status(404).json({ msg: 'Tarea no encontrada' });
    }
    
    // Verificar que la tarea pertenezca al usuario
    if(task.user._id.toString() !== req.user._id.toString()) {
        return res.json({ msg: 'Acción no permitida' });
    }

    try {
        // Eliminar la tarea
        await task.deleteOne();

        // Retornar una respuesta de éxito
        res.json({ msg: 'Tarea eliminada' });

    } catch (error) {
        console.log('Error: ', error);
    }
};

export {
    addTask, getTasks, getTask, updateTask, setFavorite, deleteTask
}