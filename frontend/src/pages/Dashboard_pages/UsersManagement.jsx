import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

function UsersManagement() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('staff');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            // Note: These endpoints don't exist in your current backend
            // You'll need to create them in Laravel
            
            // For now, we'll simulate the data or use existing endpoints
            setUsers([
                { user_id: 1, name: 'John Admin', email: 'admin@zenstyle.com', role: 'admin', phone: '+1234567890' },
                { user_id: 2, name: 'Jane Receptionist', email: 'receptionist@zenstyle.com', role: 'receptionist', phone: '+1234567891' },
                { user_id: 3, name: 'Bob Stylist', email: 'stylist@zenstyle.com', role: 'stylist', phone: '+1234567892' }
            ]);
            
            setClients([
                { client_id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567893', loyalty_points: 150 },
                { client_id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1234567894', loyalty_points: 75 },
                { client_id: 3, name: 'Carol Williams', email: 'carol@example.com', phone: '+1234567895', loyalty_points: 200 }
            ]);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container-fluid p-4" style={{ marginLeft: '250px' }}>
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
            <div className="container-fluid p-4" style={{ marginLeft: '250px' }}>
                <div className="alert alert-danger">
                    Error: {error}
                </div>
            </div>
        );
    }

    // Check permissions - only admin and receptionist can manage users
    if (!['admin', 'receptionist'].includes(user?.role)) {
        return (
            <div className="container-fluid p-4" style={{ marginLeft: '250px' }}>
                <div className="alert alert-warning">
                    <h4>Access Restricted</h4>
                    <p>Only administrators and receptionists can manage users.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4" style={{ marginLeft: '250px' }}>
            <h1 className="mb-4">User Management</h1>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'staff' ? 'active' : ''}`}
                        onClick={() => setActiveTab('staff')}
                    >
                        <i className="bi bi-people-fill me-2"></i>
                        Staff Members ({users.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'clients' ? 'active' : ''}`}
                        onClick={() => setActiveTab('clients')}
                    >
                        <i className="bi bi-person-heart me-2"></i>
                        Clients ({clients.length})
                    </button>
                </li>
            </ul>

            {/* Staff Tab */}
            {activeTab === 'staff' && (
                <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Staff Members</h5>
                        <button className="btn btn-primary btn-sm">
                            <i className="bi bi-plus-circle me-1"></i>
                            Add Staff
                        </button>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(staffUser => (
                                        <tr key={staffUser.user_id}>
                                            <td>
                                                <span className="badge bg-secondary">#{staffUser.user_id}</span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                        <i className="bi bi-person text-white"></i>
                                                    </div>
                                                    <strong>{staffUser.name}</strong>
                                                </div>
                                            </td>
                                            <td>{staffUser.email}</td>
                                            <td>{staffUser.phone}</td>
                                            <td>
                                                <span className={`badge ${
                                                    staffUser.role === 'admin' ? 'bg-danger' :
                                                    staffUser.role === 'receptionist' ? 'bg-info' :
                                                    'bg-success'
                                                }`}>
                                                    {staffUser.role.charAt(0).toUpperCase() + staffUser.role.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-success">Active</span>
                                            </td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Edit user"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    {user?.role === 'admin' && staffUser.user_id !== user.user_id && (
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Delete user"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
                <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Client Database</h5>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-download me-1"></i>
                                Export
                            </button>
                            <button className="btn btn-primary btn-sm">
                                <i className="bi bi-plus-circle me-1"></i>
                                Add Client
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Loyalty Points</th>
                                        <th>Member Since</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map(client => (
                                        <tr key={client.client_id}>
                                            <td>
                                                <span className="badge bg-info">C#{client.client_id}</span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-success rounded-circle d-flex align-items-center justify-content-center me-2">
                                                        <i className="bi bi-person-heart text-white"></i>
                                                    </div>
                                                    <strong>{client.name}</strong>
                                                </div>
                                            </td>
                                            <td>{client.email}</td>
                                            <td>{client.phone}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-star-fill text-warning me-1"></i>
                                                    <strong>{client.loyalty_points}</strong>
                                                    <small className="text-muted ms-1">pts</small>
                                                </div>
                                            </td>
                                            <td>
                                                <small className="text-muted">Jan 2024</small>
                                            </td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button 
                                                        className="btn btn-sm btn-outline-info"
                                                        title="View client details"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Edit client"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-warning"
                                                        title="Send message"
                                                    >
                                                        <i className="bi bi-envelope"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal would go here */}
            <div className="mt-4">
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Note:</strong> This is a demonstration interface. To fully implement user management, 
                    you'll need to create additional API endpoints in your Laravel backend for:
                    <ul className="mb-0 mt-2">
                        <li>GET /api/admin/users (list all staff)</li>
                        <li>GET /api/admin/clients (list all clients)</li>
                        <li>POST /api/admin/users (create staff)</li>
                        <li>PUT /api/admin/users/id (update staff)</li>
                        <li>DELETE /api/admin/users/id (delete staff)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default UsersManagement;