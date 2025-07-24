// api/dealerService.ts
import API from "./axios";
import type { DealerFormData } from "../types/DealerTypes";

export const createDealer = async (form: DealerFormData): Promise<any> => {
  const res = await API.post("/dealers", form);
  return res.data;
};

export const updateDealer = async (
  id: string,
  form: DealerFormData
): Promise<any> => {
  const res = await API.put(`/dealers/${id}`, form);
  return res.data;
};

export const deleteDealer = async (id: string): Promise<void> => {
  await API.delete(`/dealers/${id}`);
};

export const getAllDealers = async (): Promise<any> => {
  const res = await API.get("/dealers?limit=100");
  return res.data;
};
