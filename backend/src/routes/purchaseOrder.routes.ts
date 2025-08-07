import express from "express";
import {
  createPurchaseOrder,
  getAllPurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrderStatus,
} from "../controllers/purchaseOrder.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

router.post("/", requireAuth, createPurchaseOrder);
router.get("/", requireAuth, getAllPurchaseOrder);
router.get("/:id", requireAuth, getPurchaseOrderById);
router.patch("/:id/status", requireAuth, updatePurchaseOrderStatus);

export default router;
