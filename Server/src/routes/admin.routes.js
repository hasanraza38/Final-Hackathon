// import express from "express";
// import{approveLoanApplication, rejectLoanApplication} from "../controllers/admin.controlers.js"


// const router = express.Router();

// router.get("/approveapplication", approveLoanApplication);
// router.get("/rejectapplication", rejectLoanApplication);


// export default router;


import express from 'express';
import { getApplications, updateApplication } from '../controllers/admin.controllers.js';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/applications', authenticateToken, isAdmin, getApplications);
router.put('/applications/:id', authenticateToken, isAdmin, updateApplication);

export default router;