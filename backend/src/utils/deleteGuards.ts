import mongoose from "mongoose";
import { Product } from "../models/Product";
import PurchaseOrder from "../models/PurchaseOrder";
import PurchaseOrderItem from "../models/PurchaseOrderItem";
import SalesOrder from "../models/SalesOrder";
import SalesOrderItem from "../models/SalesOrderItem";

// ---------- PRODUCT RULES ----------
// 1) currentStock === 0
// 2) NOT referenced by any COMPLETED PO or SO
export async function canSoftDeleteProduct(productId: string) {
  if (!mongoose.isValidObjectId(productId)) {
    return { ok: false, reason: "Invalid product id" };
  }

  const prod = await Product.findOne({ _id: productId, deletedAt: null });
  if (!prod)
    return { ok: false, reason: "Product not found or already deleted" };

  if (Number(prod.currentStock) > 0) {
    return { ok: false, reason: "Cannot delete: product has stock on hand" };
  }

  const pid = new mongoose.Types.ObjectId(productId);

  const usedInCompletedPO = await PurchaseOrderItem.aggregate([
    { $match: { productId: pid } },
    {
      $lookup: {
        from: "purchaseorders",
        localField: "purchaseOrderId",
        foreignField: "_id",
        as: "po",
      },
    },
    { $unwind: "$po" },
    { $match: { "po.status": "Completed" } },
    { $limit: 1 },
  ]);

  if (usedInCompletedPO.length > 0) {
    return {
      ok: false,
      reason: "Cannot delete: product used in a completed Purchase Order",
    };
  }

  const usedInCompletedSO = await SalesOrderItem.aggregate([
    { $match: { productId: pid } },
    {
      $lookup: {
        from: "salesorders",
        localField: "salesOrderId",
        foreignField: "_id",
        as: "so",
      },
    },
    { $unwind: "$so" },
    { $match: { "so.status": "Completed" } },
    { $limit: 1 },
  ]);

  if (usedInCompletedSO.length > 0) {
    return {
      ok: false,
      reason: "Cannot delete: product used in a completed Sales Order",
    };
  }

  return { ok: true, product: prod };
}

// ---------- GENERIC HELPERS FOR OTHER ENTITIES ----------
export async function hasActiveProductsWithBrand(brandId: string) {
  return !!(await Product.exists({ brand: brandId, deletedAt: null }));
}

export async function hasActiveProductsWithCategory(categoryId: string) {
  return !!(await Product.exists({ category: categoryId, deletedAt: null }));
}

export async function hasActiveProductsWithDealer(dealerId: string) {
  return !!(await Product.exists({ dealer: dealerId, deletedAt: null }));
}
