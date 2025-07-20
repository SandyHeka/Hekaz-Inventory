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

function App() {
  return (
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
            <PrivateRoute>
              <ProductListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/category"
          element={
            <PrivateRoute>
              <CategoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/brand"
          element={
            <PrivateRoute>
              <BrandPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dealer"
          element={
            <PrivateRoute>
              <DealerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage>{""}</DashboardPage>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
