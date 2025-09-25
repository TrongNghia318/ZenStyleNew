import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ClientRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear validation error for this field when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d{10,}$/.test(formData.phone.replace(/\s+/g, ''))) {
            errors.phone = 'Please enter a valid phone number (at least 10 digits)';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        if (!formData.password_confirmation) {
            errors.password_confirmation = 'Please confirm your password';
        } else if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = 'Passwords do not match';
        }
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setError('');
        setValidationErrors({});
        
        // Client-side validation
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        
        setIsLoading(true);
        
        try {
            console.log('Sending data:', formData); // Debug log
            
            const response = await fetch('http://127.0.0.1:8000/api/client/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log('Response status:', response.status); // Debug log
            
            // Get response as text first to handle both JSON and HTML responses
            const responseText = await response.text();
            console.log('Raw response:', responseText); // Debug log
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                setError('Server returned invalid response. Please check if Laravel server is running.');
                return;
            }
            
            if (response.ok) {
                // Registration successful
                alert('Registration successful! Please login with your credentials.');
                navigate('/login'); // Redirect to unified login page
            } else {
                // Handle validation errors from server
                if (data.errors) {
                    setValidationErrors(data.errors);
                } else {
                    setError(data.message || 'Registration failed. Please try again.');
                }
            }
        } catch (err) {
            console.error('Network error:', err); // Debug log
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <h2 className="card-title">Create Account</h2>
                                    <p className="text-muted">Join us to book services and shop products</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">
                                            Full Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                        />
                                        {validationErrors.name && (
                                            <div className="invalid-feedback">
                                                {validationErrors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email Address <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email"
                                        />
                                        {validationErrors.email && (
                                            <div className="invalid-feedback">
                                                {validationErrors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">
                                            Phone Number <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`}
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter your phone number"
                                        />
                                        {validationErrors.phone && (
                                            <div className="invalid-feedback">
                                                {validationErrors.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter your password"
                                        />
                                        {validationErrors.password && (
                                            <div className="invalid-feedback">
                                                {validationErrors.password}
                                            </div>
                                        )}
                                        <div className="form-text">
                                            Password must be at least 6 characters long
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password_confirmation" className="form-label">
                                            Confirm Password <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${validationErrors.password_confirmation ? 'is-invalid' : ''}`}
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            value={formData.password_confirmation}
                                            onChange={handleInputChange}
                                            placeholder="Confirm your password"
                                        />
                                        {validationErrors.password_confirmation && (
                                            <div className="invalid-feedback">
                                                {validationErrors.password_confirmation}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-grid mb-3">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary btn-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="mb-0">
                                            Already have an account?{' '}
                                            <Link to="/login" className="text-decoration-none">
                                                Sign in here
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="text-center mt-3">
                            <small className="text-muted">
                                By creating an account, you agree to our Terms of Service and Privacy Policy
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientRegister;