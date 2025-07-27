import React from "react";

import type { Product } from "../../types/ProductTypes";

type Props = {
  products: Product[];
};
const ProductDealerList = ({ products }: Props) => {
  return (
    <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Product Name
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Stock
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Price
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Category
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Brand
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr className="border-t" key={product._id}>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {product.name}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {product.currentStock}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {product.price}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {product.category?.name}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {product.brand?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductDealerList;
