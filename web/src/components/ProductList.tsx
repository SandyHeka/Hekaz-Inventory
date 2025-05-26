


const ProductList = () =>{
    return(
       
            <table className="min-w-full text-sm text-left bg-white rounded-lg shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 font-medium"> Name</th>
                        <th className="px-4 py-2 font-medium">Category</th>
                        <th className="px-4 py-2 font-medium">Price</th>
                        <th className="px-4 py-2 font-medium">Quantity</th>
                        <th className="px-4 py-2 font-medium">Barcode</th>
                        <th className="px-4 py-2 font-medium">Image</th>
                        <th className="px-4 py-2 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t">
                        <td className="px-4 py-2">Iphone 17 Pro</td>
                        <td className="px-4 py-2">Electronics</td>
                        <td className="px-4 py-2">$99.99</td>
                        <td className="px-4 py-2">20</td>
                        <td className="px-4 py-2">ABC12345</td>
                        <td className="px-4 py-2">New Image</td>
                        <td className="px-4 py-2"> 
                            <button className="text-blue-600 hover:underline text-xs mr-2">
                                Edit
                            </button>
                            <button className="text-red-600 hover:underline text-xs">
                                Delete
                            </button>
                        </td>
                     
                    </tr>
                </tbody>
            </table>
           
    
    )

}


export default ProductList;