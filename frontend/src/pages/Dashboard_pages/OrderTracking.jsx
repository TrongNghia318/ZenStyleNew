import React, { useState, useEffect } from 'react';

function OrderTracking() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dateRange, setDateRange] = useState('all'); // all, today, week, month, custom
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const ordersPerPage = 10;

    // Fixed container style to prevent sidebar overlap
    const containerStyle = {
        position: 'relative',
        left: '250px',
        width: 'calc(100vw - 250px)',
        paddingRight: '15px'
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('auth_token');
            console.log('Auth token:', token); // Debug log
            
            const response = await fetch('http://127.0.0.1:8000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('Response status:', response.status); // Debug log
            console.log('Response headers:', response.headers); // Debug log
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            console.log('Data type:', typeof data); // Debug log
            
            // Your API returns {orders: [...], staff_user: "..."} 
            const ordersArray = data.orders || data || [];
            console.log('Orders array:', ordersArray); // Debug log
            console.log('Is array:', Array.isArray(ordersArray)); // Debug log
            
            // Ensure data is always an array
            setOrders(Array.isArray(ordersArray) ? ordersArray : []);
        } catch (err) {
            console.error('Fetch error:', err); // Debug log
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('auth_token');
            console.log('Updating order:', orderId, 'to status:', newStatus); // Debug
            
            const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            console.log('Update response status:', response.status); // Debug
            
            // Get response as text first to see what we're receiving
            const responseText = await response.text();
            console.log('Raw response:', responseText); // Debug
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText}`);
            }

            // Try to parse as JSON
            let updatedOrder;
            try {
                updatedOrder = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error('Server returned invalid JSON: ' + responseText.substring(0, 200));
            }
            
            console.log('Update successful:', updatedOrder); // Debug
            
            setOrders(orders.map(order => 
                order.order_id === orderId ? { ...order, status: newStatus } : order
            ));
            
            alert(`Order #${orderId} status updated to ${newStatus}`);
        } catch (err) {
            console.error('Update error:', err); // Debug
            alert('Failed to update order status: ' + err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'paid': return 'info';
            case 'cancelled': return 'danger';
            default: return 'success';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDateRangeFilter = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (dateRange) {
            case 'today':
                return {
                    start: today,
                    end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                };
            case 'week':
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 7);
                return { start: weekStart, end: weekEnd };
            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                return { start: monthStart, end: monthEnd };
            case 'custom':
                if (customStartDate && customEndDate) {
                    const start = new Date(customStartDate);
                    const end = new Date(customEndDate);
                    end.setHours(23, 59, 59, 999); // Include the entire end date
                    return { start, end };
                }
                return null;
            default:
                return null;
        }
    };

    const isDateInRange = (orderDate) => {
        const range = getDateRangeFilter();
        if (!range) return true;
        
        const date = new Date(orderDate);
        return date >= range.start && date <= range.end;
    };

    // Filter and search logic with safety checks and date filtering
    const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        const matchesSearch = !searchTerm || 
            order.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.order_id?.toString().includes(searchTerm);
        const matchesDate = isDateInRange(order.order_date);
        return matchesStatus && matchesSearch && matchesDate;
    }) : [];

    // Calculate totals for filtered orders
    const calculateFilteredTotals = () => {
        return {
            total: filteredOrders.length,
            pending: filteredOrders.filter(o => o.status === 'pending').length,
            paid: filteredOrders.filter(o => o.status === 'paid').length,
            cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
            revenue: filteredOrders
                .filter(o => o.status === 'paid')
                .reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0)
                .toFixed(2)
        };
    };

    const totals = calculateFilteredTotals();

    const getDateRangeLabel = () => {
        switch (dateRange) {
            case 'today': return 'Today';
            case 'week': return 'This Week';
            case 'month': return 'This Month';
            case 'custom': return 'Custom Range';
            default: return 'All Time';
        }
    };

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

    if (isLoading) {
        return (
            <div className="container-fluid p-4" style={containerStyle}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid p-4" style={containerStyle}>
                <div className="alert alert-danger">
                    Error: {error}
                    <button className="btn btn-sm btn-outline-primary ms-2" onClick={fetchOrders}>
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4" style={containerStyle}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Order Tracking</h1>
                <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={fetchOrders}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Refreshing...
                        </>
                    ) : (
                        <>Refresh</>
                    )}
                </button>
            </div>

            {/* Filters and Search */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label">Filter by Status:</label>
                                    <select 
                                        className="form-select"
                                        value={filterStatus}
                                        onChange={(e) => {
                                            setFilterStatus(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="All">All Orders</option>
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Date Range:</label>
                                    <select 
                                        className="form-select"
                                        value={dateRange}
                                        onChange={(e) => {
                                            setDateRange(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="all">All Time</option>
                                        <option value="today">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                        <option value="custom">Custom Range</option>
                                    </select>
                                </div>
                                {dateRange === 'custom' && (
                                    <>
                                        <div className="col-md-2">
                                            <label className="form-label">Start Date:</label>
                                            <input 
                                                type="date"
                                                className="form-control"
                                                value={customStartDate}
                                                onChange={(e) => {
                                                    setCustomStartDate(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">End Date:</label>
                                            <input 
                                                type="date"
                                                className="form-control"
                                                value={customEndDate}
                                                onChange={(e) => {
                                                    setCustomEndDate(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Search:</label>
                                            <input 
                                                type="text"
                                                className="form-control"
                                                placeholder="Search orders..."
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                                {dateRange !== 'custom' && (
                                    <div className="col-md-6">
                                        <label className="form-label">Search Orders:</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by order ID, customer name, or email..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Summary */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card bg-info text-white">
                        <div className="card-body text-center">
                            <h3>{Array.isArray(orders) ? orders.length : 0}</h3>
                            <p className="mb-0">Total Orders</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                            <h3>{Array.isArray(orders) ? orders.filter(o => o.status === 'pending').length : 0}</h3>
                            <p className="mb-0">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-danger text-white">
                        <div className="card-body text-center">
                            <h3>{Array.isArray(orders) ? orders.filter(o => o.status === 'cancelled').length : 0}</h3>
                            <p className="mb-0">Cancelled</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body text-center">
                            <h3>{Array.isArray(orders) ? orders.filter(o => o.status === 'paid').length : 0}</h3>
                            <p className="mb-0 ">Paid</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        Orders ({filteredOrders.length})
                        {searchTerm && <small className="text-muted ms-2">- filtered</small>}
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Order Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.length > 0 ? (
                                    currentOrders.map(order => (
                                        <tr key={order.order_id}>
                                            <td>
                                                <span className="badge bg-secondary">#{order.order_id}</span>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="fw-bold">{order.client?.name || order.user?.name || 'N/A'}</div>
                                                    <small className="text-muted">{order.client?.email || order.email || 'N/A'}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {order.order_details && order.order_details.length > 0 ? (
                                                        <div>
                                                            <small>
                                                                {order.order_details.slice(0, 2).map((item, idx) => (
                                                                    <div key={idx}>
                                                                        {item.inventory?.name} x{item.quantity}
                                                                    </div>
                                                                ))}
                                                                {order.order_details.length > 2 && (
                                                                    <div className="text-muted">
                                                                        +{order.order_details.length - 2} more items
                                                                    </div>
                                                                )}
                                                            </small>
                                                        </div>
                                                    ) : (
                                                        <small className="text-muted">No items</small>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="fw-bold text-success">
                                                    ${order.total_price || 0}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge bg-${getStatusColor(order.status)}`}>
                                                    {order.status || 'Unknown'}
                                                </span>
                                            </td>
                                            <td>
                                                <small>{formatDate(order.order_date)}</small>
                                            </td>
                                            <td>
                                                <select 
                                                    className="form-select form-select-sm"
                                                    value={order.status || 'pending'}
                                                    onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted py-4">
                                            <div>
                                                <i className="bi bi-cart-x fs-1 text-muted"></i>
                                                <p className="mt-2 mb-0">
                                                    {searchTerm || filterStatus !== 'All' 
                                                        ? 'No orders match your search criteria.' 
                                                        : 'No orders found.'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="mt-4" aria-label="Order pagination">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}

export default OrderTracking;