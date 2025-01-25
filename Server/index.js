import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/db/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import usersRoutes from "./src/routes/users.routes.js";
import loanRoutes from "./src/routes/loanCategories.routes.js"
import subCategoryRoutes from "./src/routes/subCategory.routes.js"
import loanApplicationRoutes from "./src/routes/loanApplication.routes.js"
import adminRoutes from "./src/routes/admin.routes.js"

const app = express();
const port =process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routes
app.use("/api/v1", adminRoutes);
app.use("/api/v1", loanRoutes);
app.use("/api/v1", loanApplicationRoutes);
app.use("/api/v1", subCategoryRoutes);
app.use("/api/v1/auth/", usersRoutes);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚙️  Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });
