import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await fetch('http://127.0.0.1:8000/api/user/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('client_data');
            localStorage.removeItem('user_type');
            navigate('/login');
            alert("You have been logged out successfully!");
        }
    };

    return (
        <nav className="d-flex flex-column flex-shrink-0 p-4 bg-dark text-white shadow" style={{ width: '250px', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
            {/* Header */}
            <div className="d-flex align-items-center justify-content-center mb-4 pb-3 border-bottom border-secondary">
    <h4 className="mb-0 text-uppercase text-white">
        <i className="bi bi-speedometer2 me-2"></i>Dashboard
    </h4>
</div>

            {/* Navigation links */}
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item mb-2">
                    <NavLink 
                        to="/dashboard/services" 
                        className="nav-link text-white d-flex align-items-center"
                    >
                        <i className="bi bi-gear-fill me-2 fs-5"></i>
                        <span>Service Management</span>
                    </NavLink>
                </li>
                
                <li className="nav-item mb-2">
                    <NavLink 
                        to="/dashboard/products" 
                        className="nav-link text-white d-flex align-items-center"
                    >
                        <i className="bi bi-box-seam me-2 fs-5"></i>
                        <span>Product Management</span>
                    </NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink 
                        to="/dashboard/orders" 
                        className="nav-link text-white d-flex align-items-center"
                    >
                        <i className="bi bi-truck me-2 fs-5"></i>
                        <span>Order Tracking</span>
                    </NavLink>
                </li>
            </ul>

            {/* Logout button */}
            <div className="mt-auto pt-3 border-top border-secondary">
                <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center fw-bold">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
            </div>
        </nav>
    );
}

export default Sidebar;