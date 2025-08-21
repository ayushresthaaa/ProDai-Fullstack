import {
  categoricalSearch,
  getTopProfiles,
  searchByAvailability,
  searchProfile,
} from "../controllers/searchPro.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js"; // JWT middleware
import express from "express";
const router = express.Router();

router.get("/", verifyToken, searchProfile);
router.get("/category", verifyToken, categoricalSearch);
router.get("/top", verifyToken, getTopProfiles);
router.get("/availability", verifyToken, searchByAvailability);
export default router;
