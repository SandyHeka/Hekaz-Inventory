import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from "./pages/ProductListPage";
import DashboardPage from "./pages/DasboardPage";
const Dashboard = () => (
  <h1 className="p-4 text-2xl font-bold text-green-700">
    Welcome to Dashboard
  </h1>
);
function App() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        /> */}
         <Route path="/products" element={token ? <ProductListPage/> : <Navigate to="/login"/>} />
           <Route path="/" element={<DashboardPage />} />
         
      </Routes>
    </BrowserRouter>
  );
}

export default App;
