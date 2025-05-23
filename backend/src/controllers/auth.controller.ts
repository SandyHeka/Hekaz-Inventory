import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import jwt from "jsonwebtoken";
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone } = req.body;
    console.log(name);

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const hashed = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      phone,
    });

    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "invalid token" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);
    if (!user) return res.json(404).json({ error: "User not found" });

    const { currentPassword, newPassword } = req.body;
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ erro: "Incorrect current password" });
    }
    user.password = await hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password updated success" });
  } catch (err) {
    console.error("Change password error: ", err);
    res.status(500).json({ error: "Failed to update the password" });
  }
};
