import express from 'express';      
import { getLoanApplicationDetails, submitLoanApplication } from '../controllers/loanApplication.controllers.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, submitLoanApplication);
router.get('/:id', authenticateToken, getLoanApplicationDetails);

export default router;        