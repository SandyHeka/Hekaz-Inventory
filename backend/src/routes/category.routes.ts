import express from "express";
import { createCategory, deleteCategory, getAllCategorys, getCAetgoryById, getCategoryById, updateCategory } from "../controllers/category.controller";
const router = express.Router();
router.post("/", createCategory);
router.get("/", getAllCategorys);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);


export default router;