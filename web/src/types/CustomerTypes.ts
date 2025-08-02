import type { StatusType } from "./StatusTypes";

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: StatusType;
};
export type CustomerFormData = Omit<Customer, "_id">;
