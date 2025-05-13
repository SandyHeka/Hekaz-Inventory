import mongoose, { Document, Schema } from "mongoose";


export interface IProduct extends Document{
    name: string;
    description:string;
    quantity:number;
    price:number;
    category:string;
}

const productSchema: Schema = new Schema<IProduct>(
    {
        name:{type:String, required:true},
        description:{type:String},
        quantity:{type:Number, required:true},
        price: {type:Number, required:true},
        category:{type:String, required:true}

    },
   { timestamps:true}
);

export const Product = mongoose.model<IProduct>("Product", productSchema);