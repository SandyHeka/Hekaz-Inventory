import express from "express";

import { requireAuth } from "../middleware/requireAuth";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customer.controller";
const router = express.Router();
router.post("/", requireAuth, createCustomer);
router.get("/", requireAuth, getAllCustomers);
router.get("/:id", requireAuth, getCustomerById);
router.put("/:id", requireAuth, updateCustomer);
router.delete("/:id", requireAuth, deleteCustomer);

export default router;
