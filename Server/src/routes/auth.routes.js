import express from 'express';
import {register, login, refreshToken, createAdmin, logout} from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-admin', createAdmin);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/logout', logout);

export default router;