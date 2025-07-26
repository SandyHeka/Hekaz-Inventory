import API from "./axios";
import {
  type StockAdjustmentPayload,
  type StockOperationPayload,
} from "../types/InventoryTypes";
import type { Product } from "../types/ProductTypes";

export const stockIn = async (payload: StockOperationPayload) => {
  return (await API.post("/inventory/in", payload)).data;
};

export const stockOut = async (payload: StockOperationPayload) => {
  return (await API.post("/inventory/out", payload)).data;
};

export const adjustStock = async (payload: StockAdjustmentPayload) => {
  return (await API.post("inventory/adjust", payload)).data;
};

export const getLowStockProducts = async (): Promise<Product[]> => {
  const res = await API.get("/inventory/low-stock");

  return res.data.lowStockProduct || [];
};
