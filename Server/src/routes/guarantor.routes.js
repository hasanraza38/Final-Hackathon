import express from 'express';   
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';
import { getGuarantorsByLoanId } from '../controllers/guarantor.controllers.js';

const router = express.Router();

router.get('/:loanId',authenticateToken, isAdmin, getGuarantorsByLoanId);

export default router;        