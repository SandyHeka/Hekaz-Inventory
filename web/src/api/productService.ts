import type { Product } from "../types/ProductTypes";
import API from "./axios";

export const createProduct = async (formData: FormData): Promise<any> => {
  const res = await API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getAllProducts = async (
  page = 1
): Promise<{ products: Product[]; totalPages: number; page: number }> => {
  const res = await API.get(`/products?page=${page}&limit=10`);
  return {
    products: res.data.products,
    totalPages: res.data.totalPages,
    page: res.data.page,
  };
};

export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<any> => {
  const res = await API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await API.delete(`/products/${productId}`);
};
