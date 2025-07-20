import express from "express";

import { upload } from "../middleware/upload";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
} from "../controllers/brand.controller";
import { requireAuth } from "../middleware/requireAuth";
const router = express.Router();

router.post("/", upload.single("image"), requireAuth, createBrand);
router.get("/", requireAuth, getAllBrand);
router.get("/:id", requireAuth, getBrandById);
router.put("/:id", upload.single("image"), requireAuth, updateBrand);
router.delete("/:id", requireAuth, deleteBrand);

export default router;
