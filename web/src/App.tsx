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

        <Route
          path="/products"
          element={
            <PublicRoute>
              <ProductListPage />
            </PublicRoute>
          }
        />
        <Route
          path="/category"
          element={
            <PublicRoute>
              <CategoryPage />
            </PublicRoute>
          }
        />
        <Route
          path="/brand"
          element={
            <PublicRoute>
              <BrandPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dealer"
          element={
            <PublicRoute>
              <DealerPage />
            </PublicRoute>
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
            <PublicRoute>
              <DashboardPage>{""}</DashboardPage>
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
