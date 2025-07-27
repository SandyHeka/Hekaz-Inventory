import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByDealer,
} from "../controllers/product.controller";
import { upload } from "../middleware/upload";
import { requireAuth } from "../middleware/requireAuth";
const router = express.Router();

router.post("/", upload.single("image"), requireAuth, createProduct);
router.get("/", requireAuth, getAllProducts);
router.get("/:id", requireAuth, getProductById);
router.put("/:id", upload.single("image"), requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);
router.get("/dealer/:dealerId", getProductsByDealer);

export default router;
