import type {
  PurchaseOrder,
  PurchaseOrderForm,
} from "../types/PurchaseOrderTypes";
import API from "./axios";

export const createPurchaseOrder = async (
  form: PurchaseOrderForm
): Promise<any> => {
  const res = await API.post("/purchase-orders", form);
  return res.data;
};

export const getAllPurchaseOrders = async (): Promise<{
  purchaseOrders: PurchaseOrder[];
}> => {
  const res = await API.get("/purchase-orders");
  return { purchaseOrders: res.data };
};

export const updatePurchaseOrderStatus = async (
  id: string,
  status: string
): Promise<any> => {
  const res = await API.patch(`/purchase-orders/${id}/status`, { status });
  return res.data;
};
