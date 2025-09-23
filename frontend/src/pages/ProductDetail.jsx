import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./css/ProductDetail.module.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, canManageProducts, isClient, userType, isStaff } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);

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
        // Populate edit form data
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

  if (!product) return <p>Loading...</p>;

  // Quantity
  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Cart - Only for clients
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (!isClient) {
      alert('Only customers can add items to cart');
      return;
    }
    setShowCartModal(true);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Please login to purchase');
      navigate('/login');
      return;
    }
    if (!isClient) {
      alert('Only customers can make purchases');
      return;
    }
    navigate("/checkout", { state: { product, quantity } });
  };

  // Edit handlers
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!isStaff) {
      alert('You do not have permission to edit products');
      return;
    }

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
      alert('Network error. Please try again.');
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
      type: product.type || 'COS'
    });
    setIsEditing(false);
  };

  // Upload image - Admin/Staff only
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

  // Delete image - Admin/Staff only
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
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Delete failed");
      } else {
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
      }
    } catch (err) {
      console.error(err);
      setError("Delete error");
    }
  };
  //delete product button
  const handleDeleteProduct = async () => {
    if (!isStaff) {
      alert('You do not have permission to delete products');
      return;
    }

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
        navigate('/products'); // Redirect to products list
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Network error. Please try again.');
    }
  };
  //Add to cart
  const handleCartQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setCartQuantity(newQuantity);
    }
  };

  const handleAddToCartConfirm = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://127.0.0.1:8000/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: product.item_id,
          quantity: cartQuantity
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShowCartModal(false);
        setCartQuantity(1);
        alert(`${cartQuantity} ${product.name} added to cart!`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Network error. Please try again.');
    }
  };

  // Submit review - Only authenticated users
  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      alert("You need to login to review this product!");
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const requestData = {
        item_id: product.item_id,
        rating: reviewRating,
        comments: reviewText,
      };

      if (!requestData.item_id) {
        alert("Error: Product ID not found");
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        setShowReview(false);
        setReviewRating(0);
        setReviewText("");
        loadFeedbacks();
        loadProduct();
      } else if (res.status === 401) {
        alert("You need to login to submit a review!");
        navigate('/login');
      } else {
        const errorData = await res.json();
        alert("Error: " + (errorData.message || 'Submit failed'));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Connection error: " + err.message);
    }
  };

  return (
    <>
      {/* Role indicator for testing */}
      {isAuthenticated && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '10px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
          <small>
            Viewing as: <strong>{userType === 'user' ? 'Staff' : 'Customer'}</strong>
            {canManageProducts && <span style={{ color: 'green' }}> • Can manage products</span>}
            {isEditing && <span style={{ color: 'orange' }}> • EDITING MODE</span>}
          </small>
        </div>
      )}

      {/* Main Product Section */}
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
                    title="Delete image (Staff only)"
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

          {/* Upload - Only visible to staff who can manage products */}
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
                title="Add image (Staff only)"
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
          <div className={styles.breadcrumb}>
            <Link to="/" className={styles.breadcrumbLink}>
              HOME
            </Link>{" "}
            /{" "}
            <Link to="/products" className={styles.breadcrumbLink}>
              PRODUCT
            </Link>
          </div>

          {/* Editable Product Name */}
          {isEditing && isStaff ? (
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
          {isEditing && isStaff ? (
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

          {/* Rating display */}
          <div className={styles.rating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={styles.star}
                style={{ color: star <= product.average_rating ? "#f1c40f" : "#ccc" }}
              >
                ★
              </span>
            ))}
            {isAuthenticated && (
              <button
                className={styles.reviewBtn}
                onClick={() => setShowReview(true)}
              >
                Write Review
              </button>
            )}
          </div>

          {/* Description */}
          {isEditing && isStaff ? (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Product Description:</label>
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

          {/* Quantity control - Only show for clients */}
          {isClient && (
            <div className={styles.orderControl}>
              <button onClick={decrement} className={styles.qtyBtn}>
                -
              </button>
              <span className={styles.qty}>{quantity}</span>
              <button onClick={increment} className={styles.qtyBtn}>
                +
              </button>
            </div>
          )}

          {/* Action buttons - Only show for clients */}
          {isClient && (
            <div className={styles.actionButtons}>
              {product.quantity === 0 ? (
                // Single prominent out of stock message
                <div style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#dc3545' }}>Currently Unavailable</h4>
                  <p style={{ margin: '0', fontSize: '14px' }}>This product is temporarily out of stock</p>
                </div>
              ) : (
                // Normal buttons when in stock
                <>
                  <button
                    className={styles.addToCartBtn}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                  <button
                    className={styles.buyNowBtn}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>
          )}

          {/* Staff view with inline editing */}
          {isStaff && isAuthenticated && (
            <div className={styles.actionButtons}>
              <div style={{
                padding: '20px',
                backgroundColor: isEditing ? '#e3f2fd' : '#f8f9fa',
                borderRadius: '8px',
                marginTop: '20px',
                border: isEditing ? '2px solid #007bff' : '1px solid #dee2e6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', minHeight: '40px' }}>
                  <h4 style={{ margin: '0', lineHeight: '1.2', marginRight: '25px' }}>Staff Management</h4>
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
                            cursor: 'pointer',
                            fontWeight: '500',
                            width: "85px"
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
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={handleSaveEdit}
                          disabled={saving}
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={saving}
                          style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p><strong>Product Condition:</strong></p>

                {isEditing ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Stock Quantity:</label>
                      <input
                        type="number"
                        name="quantity"
                        value={editFormData.quantity}
                        onChange={handleEditChange}
                        min="0"
                        style={{ padding: '8px', border: '2px solid #007bff', borderRadius: '4px', width: '100%', backgroundColor: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Low Stock Alert:</label>
                      <input
                        type="number"
                        name="threshold"
                        value={editFormData.threshold}
                        onChange={handleEditChange}
                        min="0"
                        style={{ padding: '8px', border: '2px solid #007bff', borderRadius: '4px', width: '100%', backgroundColor: '#fff' }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Product Category:</label>
                      <select
                        name="type"
                        value={editFormData.type}
                        onChange={handleEditChange}
                        style={{ padding: '8px', border: '2px solid #007bff', borderRadius: '4px', width: '200px', backgroundColor: '#fff' }}
                      >
                        <option value="COS">COSMETICS</option>
                        <option value="SHAMP">SHAMPOO</option>
                        <option value="GEL">HAIR GEL</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <p>📦 Stock Quantity: <strong>{product.quantity}</strong></p>
                    <p>🔴 Alert Threshold: <strong>{product.threshold}</strong></p>
                    <p>📅 Category: <strong>{product.type}</strong></p>
                  </div>
                )}

                {product.quantity <= product.threshold && (
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '4px',
                    color: '#856404'
                  }}>
                    <strong>⚠ Low Stock Warning!</strong> Only {product.quantity} items left in stock.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product meta - Only show for clients */}
          {isClient && (
            <div className={styles.productMeta}>
              <p className={styles.quantity}>
                📦 {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
              </p>
            </div>
          )}

          {/* Login prompt for guests */}
          {!isAuthenticated && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
              <p>Please <Link to="/login">login</Link> to purchase products or write reviews</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section - Always visible */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '30px'
      }}>
        <div className={styles.feedbackSection}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#333',
            fontSize: '28px'
          }}>
            Customer Reviews
          </h2>

          {feedbacks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              fontSize: '16px'
            }}>
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '20px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {feedbacks.map((fb, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0'
                  }}
                  className={styles.feedbackItem}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            color: star <= fb.rating ? "#f1c40f" : "#ccc",
                            fontSize: '18px',
                            marginRight: '2px'
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {fb.user && (
                        <span>
                          by {fb.user.name}
                          {isStaff && <span> ({fb.user.role})</span>}
                        </span>
                      )}
                      {fb.client && (
                        <span>
                          by {fb.client.name}
                          {isStaff && <span> (Customer)</span>}
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{
                    margin: '0',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: '#333'
                  }}>
                    {fb.comments}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Modal */}
      {showCartModal && isClient && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Add to Cart</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <img
                src={product.images?.[0]?.url || product.image_url || "/assets/img/default.jpg"}
                alt={product.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{product.name}</h4>
                <p style={{ margin: '0', color: '#666' }}>${product.unit_price} USD</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#28a745' }}>
                  {product.quantity} available
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Quantity:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => handleCartQuantityChange(cartQuantity - 1)}
                  disabled={cartQuantity <= 1}
                  style={{
                    background: cartQuantity <= 1 ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    cursor: cartQuantity <= 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  {cartQuantity}
                </span>
                <button
                  onClick={() => handleCartQuantityChange(cartQuantity + 1)}
                  disabled={cartQuantity >= product.quantity}
                  style={{
                    background: cartQuantity >= product.quantity ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    cursor: cartQuantity >= product.quantity ? 'not-allowed' : 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <strong>${(product.unit_price * cartQuantity).toFixed(2)} USD</strong>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowCartModal(false);
                  setCartQuantity(1);
                }}
              >
                Cancel
              </button>
              <button
                className={styles.submitBtn}
                onClick={handleAddToCartConfirm}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal - Only show if authenticated */}
      {showReview && isAuthenticated && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Write your review</h3>

            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setReviewRating(star)}
                  style={{
                    cursor: "pointer",
                    fontSize: "22px",
                    color: star <= reviewRating ? "#f1c40f" : "#ccc",
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              className={styles.reviewTextarea}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Enter your comment..."
            />

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowReview(false)}
              >
                Cancel
              </button>
              <button className={styles.submitBtn} onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDetail;