import express from "express";
import verifyAuth from "../middleware/authMiddleware.js"
import { addTask, getTasks, getTask, updateTask, setFavorite, deleteTask } from "../controllers/taskController.js";

// Acceder al router de express
const router = express.Router();

// Área privada
router.route('/')
    .post(verifyAuth, addTask)
    .get(verifyAuth, getTasks);

router.route('/:id')
    .get(verifyAuth, getTask)
    .put(verifyAuth, updateTask)
    .delete(verifyAuth, deleteTask);

router.put('/favorite/:id', verifyAuth, setFavorite);

export default router;