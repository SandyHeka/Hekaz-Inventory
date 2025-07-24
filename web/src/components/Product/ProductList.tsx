import { FaTrash, FaEdit } from "react-icons/fa";
import type { Product } from "../types/ProductTypes";

type Props = {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
};
const ProductList = ({ products, onDelete, onEdit }: Props) => {
  return (
    <>
      <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800 rounded-lg shadow">
        <thead className="bg-gray-100 dark:bg-gray-800 ">
          <tr>
            <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {" "}
              Name
            </th>
            <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              Category
            </th>
            <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              Brand
            </th>
            <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              Dealer
            </th>
            <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              Price
            </th>
            <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              Quantity
            </th>
            <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              Barcode
            </th>
            <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              Image
            </th>
            <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr className="border-t" key={product._id}>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {product.name}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {typeof product.category === "string"
                  ? product.category
                  : product.category?.name}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {typeof product.brand === "string"
                  ? product.brand
                  : product.brand?.name}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {typeof product.dealer === "string"
                  ? product.dealer
                  : product.dealer?.name}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {product.price}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {product.currentStock}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {product.barcode}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                <img
                  src={
                    product.imageUrl
                      ? `http://localhost:5000${
                          product.imageUrl
                        }?t=${new Date().getTime()}`
                      : "/dummy.jpg"
                  }
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white text-xs px-3 py-3 rounded transition"
                >
                  <FaEdit />
                </button>
                <button
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition"
                  onClick={() => onDelete(product._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ProductList;
