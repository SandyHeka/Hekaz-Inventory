import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Mongo connected");
    }
    catch(err){
        console.error("MangoDB connection failed:", (err as Error).message);
        process.exit(1);

    }
}