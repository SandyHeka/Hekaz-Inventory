import express from "express";
import {
  register,
  login,
  getMe,
  changePassword,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.put("/change-password", requireAuth, changePassword);
export default router;
