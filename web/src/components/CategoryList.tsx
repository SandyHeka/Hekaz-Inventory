import type{ Category } from "../types/CategoryTypes";


const CategoryList = ({
    categories
}:{
    categories: Category[];
}) =>{
    return (
        <div>
        {categories.map((cat) => (
                    <h1>{cat.name}</h1>
                ))}
        </div>
       
        
    )
}