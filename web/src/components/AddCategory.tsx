import { useState } from "react";
import { CategoryStatus } from "../types/CategoryStatusTypes";
import type { Category } from "../types/CategoryTypes";
import API from "../api/axios";


type Props ={
    existingCategory?: Category| null;
    onSuccess: () => void;


};

const AddCategoryForm = ({existingCategory = null, onSuccess} : Props) =>{
    const [form,setForm] = useState({
        name: existingCategory?.name || "",
        status: existingCategory?.status || CategoryStatus.ACTIVE,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");
        
        try{
 
            if(existingCategory){
                await API.put(`/category/${existingCategory._id}`, form,{
                      headers: { "Content-Type": "multipart/form-data" },
                });
                console.log("Submitting Form: ", form);
                setMessage("Category updated sucessfully");
            }
            else{
                await API.post("/category", form, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
                console.log("Submitting form: ", form);
                setMessage(" Category Added Successfully");
            }
            setForm({
                name:"",
                status:CategoryStatus.ACTIVE
            });
            onSuccess();
        }
        catch(err: any){
               console.error("Error response:", err.response);
    console.error("Error message:", err.message);
            setError("Failed to add category");
        }
        finally{
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>{
        setForm({...form, [e.target.name]: e.target.value})
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Category Name" 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                 required/>

            <select value={form.status}
                onChange={(e) => 
                    setForm((prev) => ({...prev, status:e.target.value as CategoryStatus}))
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                    {Object.values(CategoryStatus).map((status) =>(
                        <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
            </select>
            {message && <p className="text-green-500 text-sm">{message}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50">
                    {loading 
                    ? "Saving..."
                    : existingCategory
                    ? "Update Category"
                    : "Add Category"}
            </button>
        </form>
    )



}



export default AddCategoryForm;