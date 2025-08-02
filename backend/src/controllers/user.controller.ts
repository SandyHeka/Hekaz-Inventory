import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword } from "../utils/auth";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer";
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
      return res.status(400).json({ error: "Email already exists" });
    }
    const tempPassword = crypto.randomBytes(4).toString("hex");
    const hashed = await hashPassword(tempPassword);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      phone,
    });
    const subject = "Your Account Access for HekaZ Inventory";
    const html = `
      <p> Hello ${name}, </p>
      <p>You have been granted access as a <strong>${role}</strong>.</p>
      <p><strong>Login Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p>Please log in and change your password after login.</p>
    `;
    await sendEmail(email, subject, html);
    res
      .status(201)
      .json({ message: "User Created & Email Sent", userId: user._id });
  } catch (err) {
    console.error("❌ Failed to create user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const query = { role: { $in: ["admin", "manager", "staff"] } };
    const [users, total] = await Promise.all([
      User.find(query).select("-password").skip(skip).limit(limit),
      User.countDocuments(query),
    ]);
    const totalPage = Math.ceil(total / limit);
    res.json({ users, totalPage, page, totalUsers: total });
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
    res.status(500).json({ error: "Failed to update role" });
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
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
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
