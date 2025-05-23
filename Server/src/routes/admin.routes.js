import express from 'express';
import {
  getAllApplications,
  approveLoanApplication,
  rejectLoanApplication,
  deleteCategory,
  editCategory, 
  addCategory,
  getCategories,
  addSubcategory,
  getSingleApplication,
} from '../controllers/admin.controllers.js';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/getAllApplications', authenticateToken, isAdmin, getAllApplications);
router.get('/getSingleApplications/:id', authenticateToken, isAdmin, getSingleApplication);
router.put('/applications/:id/approve', authenticateToken, isAdmin, approveLoanApplication);
router.put('/applications/:id/reject', authenticateToken, isAdmin, rejectLoanApplication);
router.get('/getcategories', getCategories); 
router.post('/addcategory', authenticateToken, isAdmin, addCategory);
router.post('/addsubcategory/:categoryId', authenticateToken, isAdmin, addSubcategory);
router.put('/editcategory/:id', authenticateToken, isAdmin, editCategory);
router.delete('/deletecategory/:id', authenticateToken, isAdmin, deleteCategory);

export default router;