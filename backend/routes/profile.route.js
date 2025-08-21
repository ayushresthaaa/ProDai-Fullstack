import express from "express";
import {
  getProfile,
  createOrUpdateProfile,
} from "../controllers/profile.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js"; // JWT middleware
import {
  switchToProfessional,
  switchToUser,
  updateCredEmail,
  updatePassword,
  updateUsername,
} from "../controllers/updateCredentials.controller.js";

const router = express.Router();

router.get("/me", verifyToken, getProfile);

router.post("/me", verifyToken, createOrUpdateProfile);
router.post("/updateUsername", verifyToken, updateUsername);
router.post("/updatePassword", verifyToken, updatePassword);
router.post("/updateSignedEmail", verifyToken, updateCredEmail);
router.post("/switchtopro", verifyToken, switchToProfessional);
router.post("/switchtouser", verifyToken, switchToUser);
export default router;
