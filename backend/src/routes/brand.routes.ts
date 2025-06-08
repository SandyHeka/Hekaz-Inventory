import express from "express";

import { upload } from "../middleware/upload";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
} from "../controllers/brand.controller";
const router = express.Router();

router.post("/", upload.single("image"), createBrand);
router.get("/", getAllBrand);
router.get("/:id", getBrandById);
router.put("/:id", upload.single("image"), updateBrand);
router.delete("/:id", deleteBrand);

export default router;
