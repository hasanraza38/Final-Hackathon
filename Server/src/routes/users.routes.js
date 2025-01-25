import express from "express";
import { 
    registerUser ,
    loginUser,
    logoutUser,
    refreshToken,
} from "../controllers/users.controllers.js";



const router = express.Router();

router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);
router.get("/logoutuser", logoutUser);
router.post("/refreshtoken", refreshToken);


export default router;