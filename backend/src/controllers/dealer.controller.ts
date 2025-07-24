import { Request, Response } from "express";
import { Dealer } from "../models/Dealer";
import { Product } from "../models/Product";

export const createDealer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, location, owner, status } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Dealer name is reqired" });
    }
    const newDealer = await Dealer.create({
      name,
      email,
      phone,
      location,
      owner,
      status,
    });
    res.status(201).json(newDealer);
  } catch (err) {
    res.status(500).json({ error: "Failed to create dealer" });
  }
};

export const getAllDealer = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const [dealer, total] = await Promise.all([
      Dealer.find().skip(skip).limit(limit),
      Dealer.countDocuments(),
    ]);
    const totalPage = Math.ceil(total / limit);
    res.json({ dealer, totalPage, page });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dealer" });
  }
};

export const getDealerById = async (req: Request, res: Response) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) return res.status(400).json({ error: "Dealer not found" });
    res.json(dealer);
  } catch (err) {
    res.status(500).json({ error: " Failed to fetch dealer" });
  }
};

export const updateDealer = async (req: Request, res: Response) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) return res.status(404).json({ error: "Dealer not found" });
    const updatedDealer = await Dealer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedDealer);
  } catch (err) {
    res.status(500).json({ error: "Failed to update dealer" });
  }
};

export const deleteDealer = async (req: Request, res: Response) => {
  try {
    const dealerId = req.params.id;
    const usedInProducts = await Product.findOne({ dealer: dealerId });
    if (usedInProducts) {
      return res.status(400).json({
        error: "Cannot delete: Dealer is associated with existing products.",
      });
    }
    const deleteDealer = await Dealer.findByIdAndDelete(dealerId);
    if (!deleteDealer)
      return res.status(404).json({ error: "Dealer not found" });
    res.json({ message: "Dealer deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete dealer" });
  }
};
