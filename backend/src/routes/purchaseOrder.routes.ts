import express from "express";
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrderStatus,
} from "../controllers/purchaseOrder.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

router.post("/", requireAuth, createPurchaseOrder);
router.get("/", requireAuth, getAllPurchaseOrders);
router.get("/:id", requireAuth, getPurchaseOrderById);
router.patch("/:id/status", requireAuth, updatePurchaseOrderStatus);

export default router;
