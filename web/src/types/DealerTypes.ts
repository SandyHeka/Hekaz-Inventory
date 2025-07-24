import type { StatusType } from "./StatusTypes";

export type Dealer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  owner: string;
  status: StatusType;
};
export type DealerFormData = Omit<Dealer, "_id">;
