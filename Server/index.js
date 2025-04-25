import express from 'express'; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import loanApplicationRoutes from './src/routes/loanApplication.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import appointmentRoutes from './src/routes/appointment.routes.js';
import dotenv from "dotenv";
import connectDB from './src/db/index.js';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/loanapplication', loanApplicationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
// routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚙️  Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });

