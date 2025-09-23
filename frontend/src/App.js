import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Price from "./pages/Price";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import AdminProductCreate from "./pages/AdminProductCreate";


function App() {
  return (
    <BrowserRouter>
      <Routes>
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
          <Route path="admin/products/create" element={<AdminProductCreate />} />
          {/* <Route path="*" element={<div className="container py-5">404 - Not found</div>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
