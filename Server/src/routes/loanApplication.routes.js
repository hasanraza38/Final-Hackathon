import express from "express";
import { createLoanApplication, getLoanApplications, updateLoanApplication, deleteLoanApplication } from "../controllers/loanApplication.controllers.js"

const router = express.Router();

router.post("/createloanapplication", createLoanApplication);
router.get("/getloanapplication", getLoanApplications);
router.delete("/deleteloanapplication/:id", deleteLoanApplication);
router.put("/editloanapplication/:id", updateLoanApplication);


export default router;