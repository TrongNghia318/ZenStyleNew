import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "../css/ProductDetail.module.css";

function DashboardProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, canManageProducts, isStaff } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    unit_price: '',
    quantity: '',
    threshold: '',
    type: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  // Review state
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  // Load product
  const loadProduct = useCallback(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setEditFormData({
          name: data.name || '',
          unit_price: data.unit_price || '',
          quantity: data.quantity || '',
          threshold: data.threshold || '',
          type: data.type || 'COS',
          description: data.description || ''
        });

        if (data.images && data.images.length > 0) {
          setMainImage((prev) =>
            prev && prev !== "" ? prev : data.images[0].url
          );
        } else {
          setMainImage(data.image_url || "/assets/img/default.jpg");
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Load feedbacks
  const loadFeedbacks = useCallback(() => {
    if (!product?.item_id) return;
    fetch(`http://127.0.0.1:8000/api/feedbacks?item_id=${product.item_id}`)
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error(err));
  }, [product?.item_id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  if (!product) return <div className="container-fluid p-4" style={{ marginLeft: '250px' }}>Loading...</div>;

  // Edit handlers
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        await loadProduct();
        setIsEditing(false);
        alert('Product updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Lack of information.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFormData({
      name: product.name || '',
      unit_price: product.unit_price || '',
      quantity: product.quantity || '',
      threshold: product.threshold || '',
      type: product.type || 'COS',
      description: product.description || ''
    });
    setIsEditing(false);
  };

  // Upload image
  const handleUpload = async () => {
    if (!canManageProducts) {
      alert('You do not have permission to upload images');
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append("image", newImage);

      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${id}/images`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Upload failed");
      } else {
        await loadProduct();
        setNewImage(null);
        alert('Image uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
      setError("Upload connection error");
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (imageId, imageUrl) => {
    if (!canManageProducts) {
      alert('You do not have permission to delete images');
      return;
    }

    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${id}/images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.ok) {
        if (mainImage === imageUrl) {
          setMainImage(product.image_url || "/assets/img/default.jpg");
        }
        setProduct((p) => ({
          ...p,
          images: p.images
            ? p.images.filter((i) => i.image_id !== imageId)
            : [],
        }));
        alert('Image deleted successfully!');
      } else {
        const data = await res.json();
        setError(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      setError("Delete error");
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        navigate('/dashboard/products');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    

    
    <div className="container-fluid p-4" style={{ marginLeft: '250px' }}>
      {/* Back button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/dashboard/products')}
          style={{ marginLeft: '250px' }}
        >
          <i className="bi bi-arrow-left me-2" ></i>Back to Products
        </button>
      </div>

      <div className={styles.productDetail}>
        {/* Left section */}
        <div className={styles.left}>
          {/* Thumbnails */}
          <div className={styles.thumbnailList}>
            {product.images?.map((img, index) => (
              <div
                key={index}
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`${styles.thumbnail} ${mainImage === img.url ? styles.active : ""}`}
                  onClick={() => setMainImage(img.url)}
                />
                {canManageProducts && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(img.image_id, img.url)}
                    title="Delete image"
                  >
                    <span></span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Main image */}
          <div className={styles.mainImageContainer}>
            <img
              src={mainImage}
              alt={product.name}
              className={styles.productImage}
            />
          </div>

          {/* Upload */}
          {canManageProducts && (
            <div style={{ marginTop: 12 }}>
              <input
                type="file"
                accept="image/*"
                id="uploadInput"
                style={{ display: "none" }}
                onChange={(e) => setNewImage(e.target.files[0] || null)}
              />
              <button
                onClick={() =>
                  !newImage
                    ? document.getElementById("uploadInput").click()
                    : handleUpload()
                }
                disabled={uploading}
                className={styles.uploadBtn}
              >
                <span></span>
                {uploading ? "Uploading..." : !newImage ? "Add image" : "Upload"}
              </button>
              {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
            </div>
          )}
        </div>

        {/* Right section */}
        <div className={styles.right}>
          {/* Editable Product Name */}
          {isEditing ? (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Product Name:</label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  border: '2px solid #007bff',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9ff'
                }}
              />
            </div>
          ) : (
            <h1 className={styles.productName}>{product.name}</h1>
          )}

          {/* Editable Price */}
          {isEditing ? (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Price (USD):</label>
              <input
                type="number"
                step="0.01"
                name="unit_price"
                value={editFormData.unit_price}
                onChange={handleEditChange}
                style={{
                  padding: '10px',
                  fontSize: '18px',
                  border: '2px solid #007bff',
                  borderRadius: '4px',
                  width: '200px',
                  backgroundColor: '#f8f9ff'
                }}
              />
            </div>
          ) : (
            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>${product.unit_price} USD</span>
            </div>
          )}

          {/* Description */}
          {isEditing ? (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Description:</label>
              <input
                type="text"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #007bff',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9ff'
                }}
              />
            </div>
          ) : (
            <div className={styles.productDescription}>
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Staff Management Section */}
          <div className={styles.actionButtons}>
            <div style={{
              padding: '20px',
              backgroundColor: isEditing ? '#e3f2fd' : '#f8f9fa',
              borderRadius: '8px',
              marginTop: '20px',
              border: isEditing ? '2px solid #007bff' : '1px solid #dee2e6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: '0' }}>Staff Management</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteProduct}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        disabled={saving}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: saving ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label>Stock Quantity:</label>
                    <input
                      type="number"
                      name="quantity"
                      value={editFormData.quantity}
                      onChange={handleEditChange}
                      min="0"
                      style={{ padding: '8px', border: '2px solid #007bff', borderRadius: '4px', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label>Alert Threshold:</label>
                    <input
                      type="number"
                      name="threshold"
                      value={editFormData.threshold}
                      onChange={handleEditChange}
                      min="0"
                      style={{ padding: '8px', border: '2px solid #007bff', borderRadius: '4px', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label>Category:</label>
                    <select
                      name="type"
                      value={editFormData.type}
                      onChange={handleEditChange}
                      style={{ padding: '8px', border: '2px solid #007bff', borderRadius: '4px', width: '100%' }}
                    >
                      <option value="COS">COSMETICS</option>
                      <option value="SHAMP">SHAMPOO</option>
                      <option value="GEL">HAIR GEL</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <p>Stock: <strong>{product.quantity}</strong></p>
                  <p>Alert Threshold: <strong>{product.threshold}</strong></p>
                  <p>Category: <strong>{product.type}</strong></p>
                  {product.quantity <= product.threshold && (
                    <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', color: '#856404' }}>
                      <strong>Low Stock Warning!</strong> Only {product.quantity} items left.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardProductDetail;