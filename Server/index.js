// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import connectDB from "./src/db/index.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import usersRoutes from "./src/routes/users.routes.js";
// import loanRoutes from "./src/routes/loanCategories.routes.js"
// import subCategoryRoutes from "./src/routes/subCategory.routes.js"
// import loanApplicationRoutes from "./src/routes/loanApplication.routes.js"
// import adminRoutes from "./src/routes/admin.routes.js"

// const app = express();
// const port =process.env.PORT;

// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // routes
// app.use("/api/v1", adminRoutes);
// app.use("/api/v1", loanRoutes);
// app.use("/api/v1", loanApplicationRoutes);
// app.use("/api/v1", subCategoryRoutes);
// app.use("/api/v1/auth/", usersRoutes);

// connectDB()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`⚙️  Server is running at port : ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.log("MONGO DB connection failed !!! ", err);
//   });


import express from 'express'; 
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import loanRoutes from './src/routes/loan.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));   