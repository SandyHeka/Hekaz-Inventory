import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already in use" });

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role });

    return res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error("❌ Registration error:", err); // Add this line
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });
    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "login failed" });
  }
};
