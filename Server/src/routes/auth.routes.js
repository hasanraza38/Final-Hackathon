import express from 'express';
import {register, login, refreshToken, createAdmin, logout, authorizeUser} from '../controllers/auth.controllers.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-admin', createAdmin);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/logout', logout);
router.get('/authorizeuser',authenticateToken, authorizeUser);


export default router;