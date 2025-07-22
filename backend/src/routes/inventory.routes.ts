import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  adjustStock,
  stockIn,
  stockOut,
} from "../controllers/inventory.controller";
const router = express.Router();

router.post("/in", requireAuth, stockIn);
router.post("/out", requireAuth, stockOut);
router.post("/adjust", requireAuth, adjustStock);
// router.get("/low-stock", requireAuth, getLowStock);

export default router;
