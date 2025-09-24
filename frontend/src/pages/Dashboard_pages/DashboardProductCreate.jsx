import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardProductCreate() {
  const navigate = useNavigate();
  const { canManageProducts } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    threshold: '',
    unit_price: '',
    type: 'COS',
    description: '',
    image: null
  });
  const [errors, setErrors] = useState({});

  // Redirect if user doesn't have permission
  if (!canManageProducts) {
    return (
      <div className="container-fluid p-4" style={{ marginLeft: '250px' }}>
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You don't have permission to create products.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard/products')}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.quantity || formData.quantity < 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.threshold || formData.threshold < 0) newErrors.threshold = 'Valid threshold is required';
    if (!formData.unit_price || formData.unit_price <= 0) newErrors.unit_price = 'Valid price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('auth_token');
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('quantity', formData.quantity);
      submitData.append('threshold', formData.threshold);
      submitData.append('unit_price', formData.unit_price);
      submitData.append('type', formData.type);
      submitData.append('description', formData.description);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product created successfully!');
        navigate('/dashboard/products');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || 'Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4" style={{ marginLeft: '250px' }}>
      {/* Back button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/dashboard/products')}
          style={{ marginLeft: '280px' }}
        >
          <i className="bi bi-arrow-left me-2"></i>Back to Products
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Add New Product</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Quantity *</label>
                      <input
                        type="number"
                        className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                      />
                      {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Low Stock Threshold *</label>
                      <input
                        type="number"
                        className={`form-control ${errors.threshold ? 'is-invalid' : ''}`}
                        name="threshold"
                        value={formData.threshold}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                      />
                      {errors.threshold && <div className="invalid-feedback">{errors.threshold}</div>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Unit Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        className={`form-control ${errors.unit_price ? 'is-invalid' : ''}`}
                        name="unit_price"
                        value={formData.unit_price}
                        onChange={handleChange}
                        min="0.01"
                        placeholder="0.00"
                      />
                      {errors.unit_price && <div className="invalid-feedback">{errors.unit_price}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Product Type *</label>
                      <select
                        className="form-control"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="COS">COSMETICS</option>
                        <option value="SHAMP">SHAMPOO</option>
                        <option value="GEL">HAIR GEL</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter product description..."
                  />
                  <small className="text-muted">Optional. Describe the product features and benefits.</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <small className="text-muted">Optional. Accepted formats: JPG, JPEG, PNG, GIF</small>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/dashboard/products')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}