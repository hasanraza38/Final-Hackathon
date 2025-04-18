import express from 'express';
import {register, login, refreshToken, createAdmin} from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-admin', createAdmin);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router;