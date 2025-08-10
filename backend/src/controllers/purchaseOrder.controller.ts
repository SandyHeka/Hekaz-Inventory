import mongoose from "mongoose";
import PurchaseOrder from "../models/PurchaseOrder";
import PurchaseOrderItem from "../models/PurchaseOrderItem";
import { Request, Response } from "express";
import { Product } from "../models/Product";

const ORDER = ["Draft", "Ordered", "Completed", "Cancelled"] as const;
type StatusType = (typeof ORDER)[number];
const rank = (s: StatusType) => ORDER.indexOf(s);
export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { supplierId, items } = req.body;

    if (!supplierId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const orderNumber = `PO-${Date.now()}`;

    const totalAmount = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );
    const newOrder = await PurchaseOrder.create(
      [{ supplierId, orderNumber, totalAmount, status: "Draft" }],
      { session }
    );

    const orderId = newOrder[0]._id;

    const orderItem = items.map((item: any) => ({
      purchaseOrderId: orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    await PurchaseOrderItem.insertMany(orderItem, { session });
    console.log(orderItem);
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Purchase order created", orderId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      PurchaseOrder.find()
        .skip(skip)
        .limit(limit)
        .populate("supplierId", "name")
        .sort({ createdAt: -1 }),
      PurchaseOrder.countDocuments(),
    ]);
    res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPurchaseOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await PurchaseOrder.findById(id).populate(
      "supplierId",
      "name"
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    const items = await PurchaseOrderItem.find({
      purchaseOrderId: id,
    }).populate("productId", "name");
    res.json({ order, items });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePurchaseOrderStatus = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { status: nextStatus } = req.body as { status: StatusType };

  try {
    if (!ORDER.includes(nextStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const po = await PurchaseOrder.findById(id);
    if (!po) return res.status(404).json({ error: "Purchase order not found" });

    // no going backwards
    if (rank(nextStatus) < rank(po.status)) {
      return res.status(400).json({ error: "Cannot move status backwards" });
    }
    // cancelled is terminal
    if (po.status === "Cancelled" && nextStatus !== "Cancelled") {
      return res.status(400).json({ error: "Cancelled orders cannot change" });
    }

    // Apply stock only once when first entering Completed
    if (nextStatus === "Completed" && !po.stockApplied) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const items = await PurchaseOrderItem.find({
          purchaseOrderId: po._id,
        }).session(session);

        for (const it of items) {
          await Product.updateOne(
            { _id: it.productId },
            { $inc: { currentStock: it.quantity } },
            { session }
          );
        }

        po.stockApplied = true;
        po.status = nextStatus;
        await po.save({ session });

        await session.commitTransaction();
        session.endSession();
      } catch (e) {
        await session.abortTransaction();
        session.endSession();
        throw e;
      }
    } else {
      po.status = nextStatus;
      await po.save();
    }

    const updated = await PurchaseOrder.findById(id).populate(
      "supplierId",
      "name"
    );
    return res.json({ purchaseOrder: updated });
  } catch (err) {
    console.error("updatePurchaseOrderStatus error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
