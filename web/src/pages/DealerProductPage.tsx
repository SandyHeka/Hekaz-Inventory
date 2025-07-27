import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByDealer } from "../api/productService";
import DashboardPage from "./DasboardPage";
import ToastMessage from "../components/ToastMessage";
import ProductDealerList from "../components/ProductByDealer/ProductDealerList";
import Pagination from "../components/Pagination";

const DealerProductPage = () => {
  const { dealerId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [dealerName, setDealerName] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsByDealer(dealerId!);
        setProducts(res.products); // ✅ fix here
        setTotalPages(res.totalPage);
        setCurrentPage(res.page);
        setDealerName(res.dealer?.name || "");

        if (products?.length > 0 && products[0]?.dealer?.name) {
          setDealerName(products[0].dealer.name);
        }
      } catch (err) {
        console.log("Failed to fetch products: ", err);
        setError("Failed to retrieve data");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [dealerId]);
  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Product from {dealerName || "Dealer"}
      </h2>

      {error && <ToastMessage message={error} type="error" />}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Loading dealers...
            </p>
          ) : products.length > 0 ? (
            <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
              <ProductDealerList products={products} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
              No dealers found.
            </p>
          )}
        </div>
      </div>
    </DashboardPage>
  );
};

export default DealerProductPage;
