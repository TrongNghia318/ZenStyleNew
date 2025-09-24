import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireStaff = false }) {
    const { isAuthenticated, userType, user, loading } = useAuth();

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireStaff && (userType !== 'user' || !['admin', 'receptionist', 'stylist'].includes(user?.role))) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h4>Access Denied</h4>
                    <p>This area is for staff members only.</p>
                </div>
            </div>
        );
    }

    return children;
}