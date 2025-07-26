// src/pages/InventoryPage.tsx
import React, { useEffect, useState } from "react";
import InventoryTable from "../components/Inventory/InventoryTable";

import type { Product } from "../types/ProductTypes";
import { getAllProducts } from "../api/productService";
import DashboardPage from "./DasboardPage";
import ToastMessage from "../components/ToastMessage";
import Pagination from "../components/Pagination";
import StockInModal from "../components/Inventory/StockInModal";
import StockOutModal from "../components/Inventory/StockOutModal";
import AdjustStockModal from "../components/Inventory/AdjustStockModal";
import LowStockAlertCard from "../components/Inventory/LowStockAlertCard";

const InventoryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockInOpen, setStockInOpen] = useState(false);
  const [stockOutOpen, setStockOutOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);

  const fetchProducts = async (page: number = 1) => {
    try {
      const {
        products,
        totalPages,
        page: currentPage,
      } = await getAllProducts(page);
      setProducts(products);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockIn = (product: Product) => {
    setSelectedProduct(product);
    setStockInOpen(true);
  };

  const handleStockOut = (product: Product) => {
    setSelectedProduct(product);
    setStockOutOpen(true);
  };

  const handleAdjust = (product: Product) => {
    setSelectedProduct(product);
    setAdjustOpen(true);
  };

  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Inventory Management
      </h2>
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded overflow-x-auto">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              <InventoryTable
                products={products}
                onStockIn={handleStockIn}
                onStockOut={handleStockOut}
                onAdjust={handleAdjust}
              />
              <LowStockAlertCard />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              {selectedProduct && (
                <StockInModal
                  isOpen={stockInOpen}
                  product={selectedProduct}
                  onClose={() => {
                    setStockInOpen(false);
                    setSelectedProduct(null);
                  }}
                  onSuccess={() => {
                    fetchProducts();
                    setMessage("Stock addedd successfully");
                    setStockInOpen(false);
                    setSelectedProduct(null);
                  }}
                  onError={(msg) => setError(msg)}
                />
              )}
              {selectedProduct && (
                <StockOutModal
                  isOpen={stockOutOpen}
                  product={selectedProduct}
                  onClose={() => {
                    setStockOutOpen(false);
                    setSelectedProduct(null);
                  }}
                  onSuccess={() => {
                    fetchProducts();
                    setMessage("Stock removed successfully");
                    setStockOutOpen(false);
                    setSelectedProduct(null);
                  }}
                  onError={(msg) => setError(msg)}
                />
              )}
              {selectedProduct && (
                <AdjustStockModal
                  isOpen={adjustOpen}
                  product={selectedProduct}
                  onClose={() => {
                    setAdjustOpen(false);
                    setSelectedProduct(null);
                  }}
                  onSuccess={() => {
                    fetchProducts();
                    setMessage("Stock removed successfully");
                    setAdjustOpen(false);
                    setSelectedProduct(null);
                  }}
                  onError={(msg) => setError(msg)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </DashboardPage>
  );
};

export default InventoryPage;
