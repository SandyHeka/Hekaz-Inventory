// controllers/customerController.ts
import { Request, Response } from "express";
import { Customer } from "../models/Customer";

// Create customer (used by sales or system)
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const existing = await Customer.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Customer already exists" });

    const customer = await Customer.create({ name, email, phone, company });

    res.status(201).json({ message: "Customer created", customer });
  } catch (err) {
    res.status(500).json({ error: "Failed to create customer" });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(400).json({ error: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};
// Get all customers
export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, address, email } = req.body;

    const updateCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, phone, address, email },
      { new: true, runValidators: true }
    );
    if (!updateCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(updateCustomer);
  } catch (err) {
    res.status(500).json({ error: "Failed to update customer" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const deleteCustomer = await Customer.findOneAndDelete({
      _id: req.params.customerId,
    });

    if (!deleteCustomer)
      return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
};
