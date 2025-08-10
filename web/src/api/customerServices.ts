import type { CustomerFormData } from "../types/CustomerTypes";
import API from "./axios";
export const createCustomer = async (
  formData: CustomerFormData
): Promise<any> => {
  const res = await API.post("/customers", formData);
  return res.data;
};

export const getAllCustomers = async (page = 1) => {
  const res = await API.get(`/customers?page=${page}&limit=100`);
  // Normalize both 'customers' or 'customer' keys if your API varies
  const data = res.data;
  const customers = Array.isArray(data.customers)
    ? data.customers
    : Array.isArray(data.customer)
    ? data.customer
    : [];
  return {
    customers,
    totalPages: data.totalPages ?? data.totalPage ?? 1,
    page: data.page ?? 1,
  };
};
export const updateCustomer = async (
  id: string,
  form: CustomerFormData
): Promise<any> => {
  const res = await API.put(`/customers/${id}`, form);
  return res.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await API.delete(`/customers/${id}`);
};
