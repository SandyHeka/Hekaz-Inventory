import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategorys,
  getCAetgoryById,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller";
const router = express.Router();
import { upload } from "../middleware/upload";
import { requireAuth } from "../middleware/requireAuth";
router.post("/", upload.none(), requireAuth, createCategory);
router.get("/", requireAuth, getAllCategorys);
router.get("/:id", requireAuth, getCategoryById);
router.put("/:id", requireAuth, updateCategory);
router.delete("/:id", requireAuth, deleteCategory);

export default router;
