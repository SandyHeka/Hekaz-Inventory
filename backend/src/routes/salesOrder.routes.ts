import express from "express";
import {
  createSalesOrder,
  getAllSalesOrders,
  getSalesOrderById,
  updateSalesOrderStatus,
} from "../controllers/salesOrder.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

router.post("/", requireAuth, createSalesOrder);
router.get("/", requireAuth, getAllSalesOrders);
router.get("/:id", requireAuth, getSalesOrderById);
router.patch("/:id/status", requireAuth, updateSalesOrderStatus);

export default router;
