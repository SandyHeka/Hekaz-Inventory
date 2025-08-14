import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  getOverview,
  getSalesByDay,
  getTopProducts,
  getLowStock,
  getStockValuation,
  getSupplierSpend,
  getCustomerRevenue,
} from "../controllers/analytics.controller";

const router = express.Router();

router.get("/overview", requireAuth, getOverview);
router.get("/sales-by-day", requireAuth, getSalesByDay); // ?days=30
router.get("/top-products", requireAuth, getTopProducts); // ?limit=10
router.get("/low-stock", requireAuth, getLowStock); // ?limit=10
router.get("/stock-valuation", requireAuth, getStockValuation);
router.get("/supplier-spend", requireAuth, getSupplierSpend); // PO spend by supplier
router.get("/customer-revenue", requireAuth, getCustomerRevenue); // SO revenue by customer

export default router;
