import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "../css/App.module.css";

function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const { canManageProducts, isStaff } = useAuth();

  // Fixed container style to prevent sidebar overlap - ONLY responsive fix
  const containerStyle = {
    position: 'relative',
    left: '250px',
    width: 'calc(100vw - 250px)',
    paddingRight: '15px'
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container-fluid p-4" style={containerStyle}>
      <h1 className="mb-4">Product Management</h1>

      {/* Filter Bar - kept your original CSS */}
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

        {canManageProducts && (
          <Link
            to="/dashboard/products/create"
            className={styles.addProductBtn}
            rel="noopener noreferrer"
          >
            <span>+</span> Add New Product
          </Link>
        )}
      </div>

      {/* Product Grid - kept your original CSS */}
      <div className={styles.hotelList}>
        {currentProducts.map((p) => (
          <div className={styles.hotelCard} key={p.item_id}>
            <div
              className={styles.imgContainer}
              onClick={() => navigate(`/dashboard/products/${p.item_id}`)}
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
              <div className={styles.meta}>
                <span className={styles.stockInfo}>
                  Stock: <strong>{p.quantity}</strong>
                </span>
                <span className={styles.priceInfo}>
                  Price: <strong>${p.unit_price}</strong>
                </span>
              </div>
              <p className={styles.desc}>
                Alert Threshold: {p.threshold}
                {p.quantity === 0 ? (
                  <span style={{ color: '#dc3545', fontWeight: 'bold' }}> (Out of Stock!)</span>
                ) : p.quantity <= p.threshold ? (
                  <span style={{ color: '#a58805ff', fontWeight: 'bold' }}> (Low Stock!)</span>
                ) : null}
              </p>
              <button
                className={styles.btn}
                onClick={() => window.open(`/products/${p.item_id}`, '_blank')}
              >
                Manage Product
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - kept your original CSS */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageBtn} ${page === currentPage ? styles.activePage : ""}`}
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

export default ProductsManagement;