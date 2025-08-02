import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  updateUserRole,
} from "../controllers/user.controller";
import { requireAdmin } from "../middleware/requireAdmin";
const router = express.Router();
router.use(requireAuth);

router.post("/", requireAdmin, createUser);
router.get("/", requireAdmin, getAllUsers);
router.put("/:id", requireAdmin, updateUser);
router.patch("/role/:userId", requireAdmin, updateUserRole);
router.delete("/:userId", requireAdmin, deleteUser);

export default router;
