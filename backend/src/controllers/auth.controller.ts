import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

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

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    // if (user.twoFactorEnabled) {
    //   const tempToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    //     expiresIn: "5m", // short-lived
    //   });
    //   return res.status(200).json({ requires2FA: true, tempToken });
    // }
    const token = generateToken(user);
    return res.status(200).json({ token });
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
    const user = await User.findById(decoded.id).select("+password");
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
    if (!user || !user.password) {
      return res
        .status(404)
        .json({ error: "User not found or password not set" });
    }

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

export const enable2FA = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

  const secret = speakeasy.generateSecret({ name: "HekazInventory" });
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  await User.findByIdAndUpdate(userId, {
    twoFactorSecret: secret.base32,
    twoFactorEnabled: true,
  });

  res.json({ message: "Scan the QR code", qrcode: qrCode });
};

export const verify2FA = async (req: Request, res: Response) => {
  const { token: userToken, tempToken } = req.body;
  if (!tempToken) return res.status(400).json({ error: "Missing temp token" });

  try {
    const decoded: any = jwt.verify(tempToken, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);
    if (!user || !user.twoFactorSecret)
      return res.status(400).json({ error: "Invalid or expired token" });

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: userToken,
      window: 1, // ← Increase this if codes don't match
    });

    if (!isValid) return res.status(401).json({ error: "Invalid 2FA code" });

    const authToken = generateToken(user);
    res.status(200).json({ token: authToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired temp token" });
  }
};
