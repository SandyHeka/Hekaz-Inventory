import express from "express";
import {
  createDealer,
  deleteDealer,
  getAllDealer,
  getDealerById,
  updateDealer,
} from "../controllers/dealer.controller";
import { upload } from "../middleware/upload";
import { requireAuth } from "../middleware/requireAuth";
const router = express.Router();
router.post("/", upload.none(), requireAuth, createDealer);
router.get("/", requireAuth, getAllDealer);
router.get("/:id", requireAuth, getDealerById);
router.put("/:id", requireAuth, updateDealer);
router.delete("/:id", requireAuth, deleteDealer);

export default router;
