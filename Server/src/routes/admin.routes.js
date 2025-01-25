import express from "express";
import{approveLoanApplication, rejectLoanApplication} from "../controllers/admin.controlers.js"


const router = express.Router();

router.get("/approveapplication", approveLoanApplication);
router.get("/rejectapplication", rejectLoanApplication);


export default router;