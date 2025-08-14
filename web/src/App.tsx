import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from "./pages/ProductPage";
import DashboardPage from "./pages/DasboardPage";
import PublicRoute from "./routes/PublicRoute";
// import PrivateRoute from "./routes/PrivateRoute";
import CategoryPage from "./pages/CategoryPage";
import BrandPage from "./pages/BrandPage";
import DealerPage from "./pages/DealerPage";
import InventoryPage from "./pages/InventoryPage";
import PrivateRoute from "./routes/PrivateRoute";
import TwoFactorSetupPage from "./pages/TwoFactorSetupPage";
import Verify2FAPage from "./pages/Verify2FAPage";
import DealerProductPage from "./pages/DealerProductPage";
import UserPage from "./pages/UserPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import CustomerPage from "./pages/CustomerPage";
import PurchaseOrderPage from "./pages/PurchaseOrderPage";
import SalesOrderPage from "./pages/SalesOrderPage";
import AnalyticsPage from "./pages/AnalyticsPage";
function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route path="/2fa/setup" element={<TwoFactorSetupPage />} />
          <Route path="/2fa/verify" element={<Verify2FAPage />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand"
            element={
              <ProtectedRoute>
                <BrandPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dealer"
            element={
              <ProtectedRoute>
                <DealerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dealers/:dealerId/products"
            element={
              <ProtectedRoute>
                <DealerProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <CustomerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <PrivateRoute>
                <PurchaseOrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales-orders"
            element={
              <PrivateRoute>
                <SalesOrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AnalyticsPage></AnalyticsPage>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
