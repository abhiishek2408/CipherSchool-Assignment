import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;


if (!process.env.MONGO_URI) {
  console.error("MONGO_URI not set in env");
  process.exit(1);
}
await connectDB(process.env.MONGO_URI);


app.use(helmet());
app.use(cors({ origin: true, credentials: true })); 
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));


app.get("/", (req, res) => res.json({ message: "CipherStudio backend running" }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);


app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
