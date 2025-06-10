import express from "express";
import {
  createDealer,
  deleteDealer,
  getAllDealer,
  getDealerById,
  updateDealer,
} from "../controllers/dealer.controller";
import { upload } from "../middleware/upload";
const router = express.Router();
router.post("/", upload.none(), createDealer);
router.get("/", getAllDealer);
router.get("/:id", getDealerById);
router.put("/:id", updateDealer);
router.delete("/:id", deleteDealer);

export default router;
