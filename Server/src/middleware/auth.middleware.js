import dotenv, { config } from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"


// authenticate user middleware
const authenticateUser = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(404).json({ message: "no token found" });
  
    jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "invalid token" });
      req.user = user;
      next();
    });
  };
 
  // authenticate user middleware

  export  {authenticateUser}