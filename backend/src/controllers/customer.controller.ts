// controllers/customerController.ts
import { Request, Response } from "express";
import { Customer } from "../models/Customer";

// Create customer (used by sales or system)
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, status = "active" } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const existing = await Customer.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Customer already exists" });

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      status,
    });

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
export const getAllCustomers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const [customer, total] = await Promise.all([
      Customer.find().skip(skip).limit(limit),
      Customer.countDocuments(),
    ]);
    const totalPage = Math.ceil(total / limit);
    res.json({ customer, totalPage, page });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    const { id } = req.params;
    const { name, phone, address, email, status } = req.body;

    const updateCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        name: name ?? customer.name,
        phone: phone ?? customer.phone,
        address: address ?? customer.address,
        email: email ?? customer.email,
        status: status ?? customer.status,
      },
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
    const customerId = req.params.id;

    const deleteCustomer = await Customer.findOneAndDelete(customerId);

    if (!deleteCustomer)
      return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
};
