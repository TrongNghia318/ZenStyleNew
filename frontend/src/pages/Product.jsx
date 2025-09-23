import React, { useState, useEffect } from "react";
import styles from "./css/App.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // số sản phẩm mỗi trang
  const navigate = useNavigate();
  const { canManageProducts, isStaff, isClient } = useAuth();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Lọc sản phẩm theo loại
  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  // Tính số trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Cắt mảng theo trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      {/* Filter Bar with Add Product Button */}
      <div className={styles.filterBar}>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">ALL PRODUCT</option>
          <option value="COS">COSMETICS</option>
          <option value="SHAMP">SHAMPOO</option>
          <option value="GEL">HAIR GEL</option>
        </select>

        {/* Add Product Button - Only visible to admin/receptionist */}
        {canManageProducts && (
          <Link
            to="/admin/products/create"
            className={styles.addProductBtn}
          >
            <span>+</span> Add New Product
          </Link>
        )}
      </div>

      {/* Danh sách sản phẩm */}
      <div className={styles.hotelList}>
        {currentProducts.map((p) => (
          <div className={styles.hotelCard} key={p.item_id}>
            <div
              className={styles.imgContainer}
              onClick={() => navigate(`/products/${p.item_id}`)}
            >
              <img
                src={
                  p.images && p.images.length > 0
                    ? p.images[0].url
                    : p.image_url || "/assets/img/default.jpg"
                }
                alt={p.name}
              />
            </div>
            <div className={styles.hotelInfo}>
              <h2>{p.name}</h2>

              {/* Different info for staff vs clients */}
              {isStaff ? (
                // Staff see full inventory information
                <>
                  <div className={styles.meta}>
                    <span className={styles.stockInfo}>
                      📦 Stock: <strong>{p.quantity}</strong>
                    </span>
                    <span className={styles.priceInfo}>
                      💰 Price: <strong>${p.unit_price}</strong>
                    </span>
                  </div>
                  <p className={styles.desc}>
                    🔴 Alert Threshold: {p.threshold}
                    {p.quantity === 0 ? (
                      <span style={{ color: '#dc3545', fontWeight: 'bold' }}> (Out of Stock!)</span>
                    ) : p.quantity <= p.threshold ? (
                      <span style={{ color: '#a58805ff', fontWeight: 'bold' }}> (Low Stock!)</span>
                    ) : null}
                  </p>
                </>
              ) : (
                // Clients see simplified information
                <div className={styles.meta}>
                  <span className={styles.stockInfo}>
                    📦 {p.quantity > 0 ? `${p.quantity} Available` : 'Out of Stock'}
                  </span>
                  <span className={styles.priceInfo}>
                    💰 <strong>${p.unit_price}</strong>
                  </span>
                </div>
              )}

              <button
                className={styles.btn}
                onClick={() => navigate(`/products/${p.item_id}`)}
                disabled={!isStaff && p.quantity === 0}
                style={{
                  opacity: (!isStaff && p.quantity === 0) ? 0.5 : 1,
                  cursor: (!isStaff && p.quantity === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                {isStaff ? 'Manage Product' : (p.quantity > 0 ? 'Buy Now' : 'Out of Stock')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageBtn} ${page === currentPage ? styles.activePage : ""
                }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;