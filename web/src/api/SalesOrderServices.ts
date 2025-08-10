import API from "./axios";
import type { SalesOrder, SalesOrderForm } from "../types/SalesOrderTypes";

export const createSalesOrder = async (form: SalesOrderForm) => {
  const res = await API.post("/sales-orders", form);
  return res.data;
};

export const getAllSalesOrders = async (
  page = 1
): Promise<{ salesOrders: SalesOrder[]; totalPages: number; page: number }> => {
  const res = await API.get(`/sales-orders?page=${page}&limit=10`);
  const orders = (res.data.orders || []).map((o: any) => {
    const c = o?.customerId;
    return {
      ...o,
      customerName: typeof c === "string" ? "" : c?.name ?? "",
      customerId: typeof c === "string" ? c : c?._id ?? "",
    } as SalesOrder;
  });

  return {
    salesOrders: orders,
    totalPages: res.data.totalPages,
    page: res.data.page,
  };
};

export const getSalesOrderById = async (id: string) => {
  const res = await API.get(`/sales-orders/${id}`);
  return { order: res.data.order, items: res.data.items || [] };
};

export const updateSalesOrderStatus = async (id: string, status: string) => {
  const res = await API.patch(`/sales-orders/${id}/status`, { status });
  return res.data;
};
