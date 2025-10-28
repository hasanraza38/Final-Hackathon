import express from 'express'; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import loanApplicationRoutes from './routes/loanApplication.routes.js';
import adminRoutes from './routes/admin.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import dotenv from "dotenv";
import connectDB from './db/index.js';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:"https://saylani-microfinance0.vercel.app/", 
    credentials: true, 
    optionsSuccessStatus: 200,
  })
);

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

