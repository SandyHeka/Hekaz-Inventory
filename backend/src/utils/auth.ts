import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
const JWT_SECRET = process.env.JWT_SECRET as string;

export const hashPassword = async (plain: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = (
  password: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashed); // error: if hashed is undefined
};
export const generateToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};
