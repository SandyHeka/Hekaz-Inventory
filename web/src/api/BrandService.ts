import API from "./axios";

export const createBrand = async (form: FormData): Promise<any> => {
  const res = await API.post("/brands", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const getAllBrand = async (limit = 20): Promise<any> => {
  const res = await API.get(`/brands?limit=${limit}`);

  return res.data;
};
export const updateBrand = async (
  id: string,
  formData: FormData
): Promise<any> => {
  const res = await API.put(`/brands/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteBrand = async (id: string): Promise<void> => {
  await API.delete(`/brands/${id}`);
};
