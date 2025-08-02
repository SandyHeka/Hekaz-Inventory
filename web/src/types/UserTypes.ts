export type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "staff";
};
