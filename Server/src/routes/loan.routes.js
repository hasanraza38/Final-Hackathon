import express from 'express';      
import { submitLoan, getLoanDetails } from '../controllers/loan.controllers.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, submitLoan);
router.get('/:id', authenticateToken, getLoanDetails);

export default router;        