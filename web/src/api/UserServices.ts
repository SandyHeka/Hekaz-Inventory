import API from "./axios";

export const getAllUsers = async (page = 1): Promise<any> => {
  const res = await API.get(`/users?page=${page}&limit=10`);
  console.log(res);
  return res.data;
};

export const createUser = async (formData: FormData) => {
  return await API.post("/users", formData);
};

export const updateUser = async (id: string, formData: FormData) => {
  return await API.put(`/users/${id}`, formData);
};

export const deleteUser = async (id: string) => {
  return await API.delete(`/users/${id}`);
};
