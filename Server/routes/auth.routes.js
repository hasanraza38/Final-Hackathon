import express from 'express';
import {register, login, refreshToken, createAdmin, logout, authenticatedUser} from '../controllers/auth.controllers.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-admin', createAdmin);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout); 
router.get('/authenticateuser',authenticateToken, authenticatedUser);


export default router;