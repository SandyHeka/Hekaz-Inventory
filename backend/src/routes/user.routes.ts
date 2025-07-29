import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  updateUserRole,
} from "../controllers/user.controller";
const router = express.Router();
router.use(requireAuth);

router.post("/", createUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.patch("/role/:userId", updateUserRole);
router.delete("/:userId", deleteUser);

export default router;
