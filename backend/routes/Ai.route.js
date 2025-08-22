import express from "express";
import { getAIRecommendations } from "../controllers/AI.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js"; // optional, if you want auth

const router = express.Router();

router.get("/:userId", verifyToken, getAIRecommendations);

export default router;
