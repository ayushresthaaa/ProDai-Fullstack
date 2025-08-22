import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/profile.route.js";
import dotenv from "dotenv";
import searchRoutes from "./routes/searchPro.route.js";
import aiRoutes from "./routes/Ai.route.js";
dotenv.config();

const app = express();

// CORS middleware - allow requests from your React frontend
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you use cookies or authorization headers
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/ai-recommendation", aiRoutes);
export default app;
