import express from "express";
import { signUp, logIn, confirmEmail, account, forgotPassword, verifyToken, resetPassword, updateAccount, changePassword, deleteAccount } from "../controllers/userController.js";
import verifyAuth from "../middleware/authMiddleware.js";

// Acceder al touter de express
const router = express.Router();

// Área pública
router.post('/', signUp);
router.get('/confirm/:token', confirmEmail);
router.post('/login', logIn);
router.post('/reset-password', forgotPassword);
router.route('/reset-password/:token').get(verifyToken).post(resetPassword);

// Área privada
router.get('/account', verifyAuth, account);
router.put('/account/:id', verifyAuth, updateAccount);
router.put('/change-password', verifyAuth, changePassword);
router.get('/delete-account/:id', verifyAuth, deleteAccount); // Completar

export default router;
