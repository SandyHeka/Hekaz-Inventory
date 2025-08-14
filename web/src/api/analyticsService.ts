import API from "./axios";

export const getOverview = async () => {
  const { data } = await API.get("/analytics/overview");
  return data;
};

export const getSalesByDay = async (days = 30) => {
  const { data } = await API.get(`/analytics/sales-by-day?days=${days}`);
  return data; // { days, series: [{date,total}] }
};

export const getTopProducts = async (limit = 10) => {
  const { data } = await API.get(`/analytics/top-products?limit=${limit}`);
  return data; // { items: [{ name, totalQty, revenue }] }
};

export const getLowStock = async (limit = 10) => {
  const { data } = await API.get(`/analytics/low-stock?limit=${limit}`);
  return data; // { items: [...] }
};

export const getStockValuation = async () => {
  const { data } = await API.get(`/analytics/stock-valuation`);
  return data; // { total }
};

export const getSupplierSpend = async () => {
  const { data } = await API.get(`/analytics/supplier-spend`);
  return data; // { items: [...] }
};

export const getCustomerRevenue = async () => {
  const { data } = await API.get(`/analytics/customer-revenue`);
  return data; // { items: [...] }
};
