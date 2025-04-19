import express from 'express';
import {
  getApplications,
  approveLoanApplication,
  rejectLoanApplication,
  deleteCategory,
  editCategory, 
  addCategory,
  getCategories,
  addSubcategory,
} from '../controllers/admin.controllers.js';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Loan application routes
router.get('/applications', authenticateToken, isAdmin, getApplications);
router.put('/applications/:id/approve', authenticateToken, isAdmin, approveLoanApplication);
router.put('/applications/:id/reject', authenticateToken, isAdmin, rejectLoanApplication);
router.get('/getcategries', authenticateToken, getCategories); // Allow all authenticated users to fetch categories
router.post('/addcategory', authenticateToken, isAdmin, addCategory);
router.post('/addsubcategory/:categoryId', authenticateToken, isAdmin, addSubcategory);
router.put('/editcategory/:id', authenticateToken, isAdmin, editCategory);
router.delete('/deletecategory/:id', authenticateToken, isAdmin, deleteCategory);

export default router;