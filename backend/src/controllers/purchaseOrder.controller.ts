import mongoose from "mongoose";
import PurchaseOrder from "../models/PurchaseOrder";
import PurchaseOrderItem from "../models/PurchaseOrderItem";
import { Request, Response } from "express";
import { Product } from "../models/Product";
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

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Purchase order created", orderId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate("supplierId", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
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
    const items = await PurchaseOrderItem.find({
      purchaseOrderId: id,
    }).populate("productId", "name");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ order, items });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePurchaseOrderStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await PurchaseOrder.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status === "Received" && order.status !== "Received") {
      const items = await PurchaseOrderItem.findById({ purchaseOrderId: id });

      for (const item of items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();

    res.json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
