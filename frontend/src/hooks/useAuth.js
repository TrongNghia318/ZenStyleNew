import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    const clientData = localStorage.getItem('client_data');
    const type = localStorage.getItem('user_type');

    if (token) {
      if (type === 'user' && userData) {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setUserType('user');
      } else if (type === 'client' && clientData) {
        const parsedClient = JSON.parse(clientData);
        setIsAuthenticated(true);
        setUser(parsedClient);
        setUserType('client');
      } else {
        // Token exists but no valid user data - clear everything
        clearAuth();
      }
    } else {
      clearAuth();
    }
    setLoading(false);
  };

  const clearAuth = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
  };

  useEffect(() => {
    checkAuth();

    // Listen for localStorage changes (different tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' || e.key === 'user_data' || e.key === 'client_data' || e.key === 'user_type') {
        checkAuth();
      }
    };

    // Listen for custom auth change events (same tab)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const logout = () => {
  // Clear localStorage immediately
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('client_data');
  localStorage.removeItem('user_type');

  // Update state immediately
  setIsAuthenticated(false);
  setUser(null);
  setUserType(null);

  // Trigger auth change event
  window.dispatchEvent(new Event('auth-change'));

  // Force a complete page reload to ensure clean state
  window.location.href = '/';
};
  // Helper flags
  const isStaff = userType === 'user';
  const isClient = userType === 'client';
  const isAdmin = isStaff && user?.role === 'admin';
  const canManageProducts = isStaff && ['admin', 'receptionist'].includes(user?.role);
  const canViewAllOrders = isStaff && ['admin', 'receptionist', 'stylist'].includes(user?.role);

  return {
    isAuthenticated,
    user,
    userType,
    loading,
    logout,
    // Helper flags
    isStaff,
    isClient,
    isAdmin,
    canManageProducts,
    canViewAllOrders
  };
};