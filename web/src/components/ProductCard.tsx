const ProductCard = () => {
  return (
   
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded shadow">
              <div className="flex items-center gap-4">
                <img src="https://via.placeholder.com/48" alt="Product" className="w-12 h-12 rounded" />
                <div>
                  <div className="font-semibold">Product {i}</div>
                  <div className="text-sm text-gray-500">Review: 4.5★</div>
                </div>
              </div>
              <div className="flex gap-8 text-sm">
                <div>
                  <div>Performance</div>
                  <div>Good</div>
                </div>
                <div>
                  <div>Stock</div>
                  <div>{100 * i}</div>
                </div>
                <div>
                  <div>Product Price</div>
                  <div>$ {(20 + i * 10).toFixed(2)} USD</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      
  );
};

export default ProductCard;
