import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import DashboardLayout from "./components/Dashboard/DashboardLayout";

// Public pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Price from "./pages/Price";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import ClientRegister from "./pages/ClientRegister";

// Service booking pages
import Haircut from "./pages/page_Sevice/Haircut";
import Makeup from "./pages/page_Sevice/Makeup";
import Manicure from "./pages/page_Sevice/Manicure";
import Pedicure from "./pages/page_Sevice/Pedicure";
import Massage from "./pages/page_Sevice/Massage";
import SkinCare from "./pages/page_Sevice/SkinCare";

// Admin/Dashboard pages
import AdminProductCreate from "./pages/AdminProductCreate";
import ServicesPage from "./pages/Dashboard_pages/ServicesPage";
import UsersManagement from "./pages/Dashboard_pages/UsersManagement";
import ProductsManagement from "./pages/Dashboard_pages/ProductsManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardProductDetail from "./pages/Dashboard_pages/DashboardProductDetail";
import DashboardProductCreate from "./pages/Dashboard_pages/DashboardProductCreate";
import OrderTracking from "./pages/Dashboard_pages/OrderTracking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with main layout */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="price" element={<Price />} />
          <Route path="products" element={<Product />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="client/register" element={<ClientRegister />} />

          {/* Service booking routes */}
          <Route path="services/haircut" element={<Haircut />} />
          <Route path="services/makeup" element={<Makeup />} />
          <Route path="services/manicure" element={<Manicure />} />
          <Route path="services/pedicure" element={<Pedicure />} />
          <Route path="services/massage" element={<Massage />} />
          <Route path="services/skincare" element={<SkinCare />} />

          {/* Admin product creation (with auth check inside component) */}
          <Route path="admin/products/create" element={<AdminProductCreate />} />
        </Route>

        {/* Dashboard routes with dashboard layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute requireStaff={true}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="services" element={<ServicesPage />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="products/:id" element={<DashboardProductDetail />} />
          <Route path="products/create" element={<DashboardProductCreate />} />
          <Route path="orders" element={<OrderTracking />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<div className="container py-5">404 - Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;