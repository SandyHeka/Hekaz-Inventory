import express from "express";
import {
  register,
  login,
  getMe,
  changePassword,
  enable2FA,
  verify2FA,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.put("/change-password", requireAuth, changePassword);
router.post("/2fa/enabled", requireAuth, enable2FA);
router.post("/2fa/verify", verify2FA);

export default router;
