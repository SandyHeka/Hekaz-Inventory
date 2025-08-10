import type {
  PurchaseOrder,
  PurchaseOrderForm,
  PurchaseOrderItem,
} from "../types/PurchaseOrderTypes";
import API from "./axios";

export const createPurchaseOrder = async (
  form: PurchaseOrderForm
): Promise<any> => {
  const res = await API.post("/purchase-orders", form);
  return res.data;
};

export const getAllPurchaseOrders = async (
  page = 1
): Promise<{
  purchaseOrders: PurchaseOrder[];
  totalPages: number;
  page: number;
}> => {
  const res = await API.get(`/purchase-orders?page=${page}&limit=10`);

  return {
    purchaseOrders: res.data.orders,
    totalPages: res.data.totalPages,
    page: res.data.page,
  };
};

export const updatePurchaseOrderStatus = async (id: string, status: string) => {
  const res = await API.patch(`/purchase-orders/${id}/status`, { status });
  return res.data;
};
export const getPurchaseOrderById = async (
  id: string
): Promise<{
  order: PurchaseOrder;
  items: PurchaseOrderItem[];
}> => {
  const res = await API.get(`/purchase-orders/${id}`);
  // Normalize supplier fields if needed
  const s = res.data.order?.supplierId;
  const order: PurchaseOrder = {
    ...res.data.order,
    supplierName:
      typeof s === "string" ? res.data.order.supplierName ?? "" : s?.name ?? "",
    supplierId: typeof s === "string" ? s : s?._id ?? "",
  };
  return { order, items: res.data.items || [] };
};
