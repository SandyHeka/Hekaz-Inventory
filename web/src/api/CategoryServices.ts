import type { CategoryFormData } from "../types/CategoryTypes";
import API from "./axios";

export const createCategory = async (form: CategoryFormData): Promise<any> => {
  const res = await API.post("/category", form);
  return res.data;
};
export const getAllCategory = async (limit = 20): Promise<any> => {
  const res = await API.get(`/category?limit=${limit}}`);
  return res.data;
};
export const updateCategory = async (
  id: string,
  form: CategoryFormData
): Promise<any> => {
  const res = await API.put(`/category/${id}`, form);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await API.delete(`/category/${id}`);
};
