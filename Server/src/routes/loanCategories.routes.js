import express from "express";

import{createLoanCategory, getAllLoanCategories, getSingleLoanCategory, updateLoanCategory, deleteLoanCategory} from "../controllers/loanCategory.controllers.js"


const router = express.Router();

router.post("/createLoan", createLoanCategory);
router.get("/getallLoans", getAllLoanCategories);
router.get("/getsingleLoan/:id", getSingleLoanCategory);
router.delete("/deleteloan/:id", deleteLoanCategory);
router.put("/editloan/:id", updateLoanCategory);


export default router;