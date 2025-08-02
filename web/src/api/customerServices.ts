import type { CustomerFormData } from "../types/CustomerTypes";
import API from "./axios";
export const createCustomer = async (
  formData: CustomerFormData
): Promise<any> => {
  const res = await API.post("/customers", formData);
  return res.data;
};

export const getAllCustomer = async (limit = 20): Promise<any> => {
  const res = await API.get(`/customers?limit=${limit}`);
  return res.data;
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
