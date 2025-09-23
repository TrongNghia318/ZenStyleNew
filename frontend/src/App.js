import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ---- COMPONENTS
// Import các components layout
import MainLayout from "./components/MainLayout";
import DashboardLayout from "./components/Dashboard/DashboardLayout";

// Import các trang chính
import Home from "./pages/Home";
import Services from "./pages/Services";
import Price from "./pages/Price";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/Dashboard_pages/AdminLogin";

// ---- DASHBOARD PAGES
import ServicesPage from "./pages/Dashboard_pages/ServicesPage";
// THÊM: Import component AdminPage


// ---- PUBLIC SERVICE PAGES
import Pedicure from "./pages/page_Sevice/Pedicure";
import Haircut from "./pages/page_Sevice/Haircut";
import Massage from "./pages/page_Sevice/Massage";
import SkinCare from "./pages/page_Sevice/SkinCare";
import Manicure from "./pages/page_Sevice/Manicure";
import Makeup from "./pages/page_Sevice/Makeup";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route public với MainLayout */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="price" element={<Price />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />

          <Route path="haircut" element={<Haircut />} />
          <Route path="makeup" element={<Makeup />} />
          <Route path="pedicure" element={<Pedicure />} />
          <Route path="massage" element={<Massage />} />
          <Route path="skincare" element={<SkinCare />} />
          <Route path="manicure" element={<Manicure />} />
        </Route>

        {/* Các route dashboard với DashboardLayout */}
        <Route path="dashboard" element={<DashboardLayout />}>


          <Route path="services" element={<ServicesPage />} />
        </Route>

        {/* Các route độc lập không có layout */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="admin/login" element={<AdminLogin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;