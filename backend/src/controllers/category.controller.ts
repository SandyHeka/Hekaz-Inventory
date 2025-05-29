import { Request , Response } from "express";
import { Category } from '../models/Category';



export const createCategory = async (req: Request, res: Response) =>{
    try{
       const { name, status } = req.body;

        if (!name) {
        return res.status(400).json({ message: "Category name is required" });
        }

        const newCategory = await Category.create({ name, status });

        res.status(201).json(newCategory);
    }
    catch(err){
        console.log("Category Creation error: ", err);
        res.status(500).json({error: "Failed to create category"});

    }



}



export const getAllCategorys = async (_req: Request, res: Response)=>{
    try{
        const category = await Category.find();
        res.json(category);

    }
    catch(err){
        res.status(500).json({error : "Failed to fetch category"});
    }

}

export const getCategoryById = async(req: Request, res : Response)=>{
    try{
        const category = await Category.findById(req.params.id);
        if(!category) return res.status(400).json({error : "Category not found"});
        res.json(category);
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch category"});
    }

}


export const updateCategory = async(req: Request, res: Response)=>{
    try{
        const category = await Category.findById(req.params.id);
        if(!category) return res.status(404).json({error: "Catgeory not found"});
        const updated = await Category.findByIdAndUpdate(req.params.id, ...req.body);
        res.json(updated);
    
    }
    catch(err){
        res.status(500).json({error: "Failed to update category"});

    }



}

export const deleteCategory = async (req: Request, res: Response)=>{
    try{
        const deleteCategory = Category.findById(req.params.id);
        if(!deleteCategory) return res.status(404).json({error: "Category not found"});
        res.json({message: "Category deleted"});

    }
    catch(err){
        res.status(500).json({error: "Failed to delete category"});
    }
}