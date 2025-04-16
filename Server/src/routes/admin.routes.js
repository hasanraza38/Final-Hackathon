import express from 'express';
import {
  getApplications,
  approveLoanApplication,
  rejectLoanApplication,
  addLoan,
  editLoan,
  deleteLoan,
  addSubcategory,
  editSubcategory,
  deleteSubcategory,
  getSubcategories
} from '../controllers/admin.controllers.js';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Loan application routes
router.get('/applications', authenticateToken, isAdmin, getApplications);
router.put('/applications/:id/approve', authenticateToken, isAdmin, approveLoanApplication);
router.put('/applications/:id/reject', authenticateToken, isAdmin, rejectLoanApplication);
router.post('/loans', authenticateToken, isAdmin, addLoan);
router.put('/loans/:id', authenticateToken, isAdmin, editLoan);
router.delete('/loans/:id', authenticateToken, isAdmin, deleteLoan);

// Subcategory routes
router.get('/subcategories', authenticateToken, isAdmin, getSubcategories);
router.post('/subcategories', authenticateToken, isAdmin, addSubcategory);
router.put('/subcategories/:id', authenticateToken, isAdmin, editSubcategory);
router.delete('/subcategories/:id', authenticateToken, isAdmin, deleteSubcategory);

export default router;