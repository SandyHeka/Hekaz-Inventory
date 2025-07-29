import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword } from "../utils/auth";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!["admin", "manager", "staff"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const requester = (req as any).user;
    if (!requester || !["admin", "manager"].includes(requester.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (role === "admin" && requester.role !== "admin") {
      return res.status(403).json({ error: "can create another admin" });
    }

    if (await User.findOne({ email })) {
      return res.json(400).json({ error: "Email already exists" });
    }
    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      phone,
    });

    res.status(201).json({ message: "User Created", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      role: { $in: ["admin", "manager", "staff"] },
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;
  if (!["admin", "manager", "staff"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  try {
    const updated = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    res.json(500).json({ error: "Failed to update role" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone, role },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updateUser) {
      return res.json(404).json({ error: "User not found" });
    }
    res.json(updateUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.userId);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
