import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    time: {
        type: String,
        default: 'NA'
    },
    favorite: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Registrar el modelo para las tareas 
const Task = mongoose.model('Task', taskSchema);
export default Task;