import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/connectdb.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());

//database connection
connectDB(DATABASE_URL);

//JSON
app.use(express.json());

//Load Routes
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Serve listening at http://localhost:${PORT}`);
});
