import React, { useState, useEffect } from 'react';

function ServicesManagement() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('http://127.0.0.1:8000/api/bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            
            const data = await response.json();
            setBookings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddOrUpdateBooking = (updatedBooking) => {
        if (editingBooking) {
            setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        } else {
            setBookings([updatedBooking, ...bookings]);
        }
        setEditingBooking(null);
    };

    const handleDeleteBooking = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`http://127.0.0.1:8000/api/bookings/${id}`, { 
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete booking');
                }
                
                setBookings(bookings.filter(b => b.id !== id));
                alert('Booking deleted successfully!');
            } catch (err) {
                setError(err.message);
                alert('Failed to delete booking: ' + err.message);
            }
        }
    };

    const handleEditClick = (booking) => setEditingBooking(booking);
    const handleCancelEdit = () => setEditingBooking(null);

    const formatTimeWithPeriod = (timeString) => {
        if (!timeString) return '';
        const hour = parseInt(timeString.split(':')[0], 10);
        let period = '';
        if (hour >= 6 && hour < 12) period = 'morning';
        else if (hour >= 12 && hour < 18) period = 'afternoon';
        else period = 'evening';
        const formattedTime = timeString.replace(/:00$/, '');
        return `${formattedTime} (${period})`;
    };

    if (isLoading) {
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
                    <button className="btn btn-sm btn-outline-primary ms-2" onClick={fetchBookings}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4" style={{ marginLeft: '250px' }}>
            <h1 className="mb-4">Booking Management</h1>

            <div className="row">
                {/* Booking Form */}
                <div className="col-12 col-lg-4 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header">
                            <h4 className="mb-0">
                                {editingBooking ? 'Edit Booking' : 'Add New Booking'}
                            </h4>
                        </div>
                        <div className="card-body">
                            <BookingForm
                                onAddOrUpdateBooking={handleAddOrUpdateBooking}
                                editingBooking={editingBooking}
                                onCancelEdit={handleCancelEdit}
                            />
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">All Bookings ({bookings.length})</h4>
                            <button 
                                className="btn btn-sm btn-outline-primary" 
                                onClick={fetchBookings}
                                disabled={isLoading}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Refresh
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <table className="table table-hover mb-0">
                                    <thead className="table-light sticky-top">
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer</th>
                                            <th>Contact</th>
                                            <th>Service</th>
                                            <th>Stylist</th>
                                            <th>Room</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Notes</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length > 0 ? (
                                            bookings.map(booking => (
                                                <tr key={booking.id}>
                                                    <td>
                                                        <span className="badge bg-secondary">#{booking.id}</span>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div className="fw-bold">{booking.name}</div>
                                                            <small className="text-muted">{booking.email}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <small>{booking.phone}</small>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary">{booking.service}</span>
                                                    </td>
                                                    <td>{booking.stylist}</td>
                                                    <td>
                                                        <span className="badge bg-info">{booking.room}</span>
                                                    </td>
                                                    <td>{booking.booking_date}</td>
                                                    <td>{formatTimeWithPeriod(booking.booking_time)}</td>
                                                    <td>
                                                        <small>{booking.notes || '-'}</small>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <button
                                                                className="btn btn-sm btn-outline-warning"
                                                                onClick={() => handleEditClick(booking)}
                                                                title="Edit booking"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDeleteBooking(booking.id)}
                                                                title="Delete booking"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center text-muted py-4">
                                                    <div>
                                                        <i className="bi bi-calendar-x fs-1 text-muted"></i>
                                                        <p className="mt-2 mb-0">No bookings found.</p>
                                                        <small>Add your first booking using the form on the left.</small>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Booking Form Component (Admin version)
function BookingForm({ onAddOrUpdateBooking, editingBooking, onCancelEdit }) {
    const [bookingData, setBookingData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        stylist: '',
        room: '',
        booking_date: '',
        booking_time: '',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Service options
    const services = ['Haircut', 'Makeup', 'Manicure', 'Pedicure', 'Massage', 'SkinCare'];
    const stylists = [
        'Straight short hair', 'Shoulder-length haircut', 'Korean layered short hair',
        'No Makeup Makeup', 'Bold Makeup', 'Smoky Eye Makeup',
        'Gel Manicure', 'Acrylic Manicure', 'Press-On Nails',
        'Hot Stones Pedicure', 'Paraffin Pedicure', 'French Pedicure',
        'Swedish Massage', 'Reflexology', 'Craniosacral Therapy',
        'Jessica', 'Olivia', 'Sophia'
    ];
    const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4'];

    useEffect(() => {
        if (editingBooking) {
            const formattedDate = editingBooking.booking_date
                ? editingBooking.booking_date.split('T')[0]
                : '';

            setBookingData({
                name: editingBooking.name || '',
                email: editingBooking.email || '',
                phone: editingBooking.phone || '',
                service: editingBooking.service || '',
                stylist: editingBooking.stylist || '',
                room: editingBooking.room || '',
                booking_date: formattedDate,
                booking_time: editingBooking.booking_time || '',
                notes: editingBooking.notes || '',
            });
        } else {
            setBookingData({
                name: '',
                email: '',
                phone: '',
                service: '',
                stylist: '',
                room: '',
                booking_date: '',
                booking_time: '',
                notes: '',
            });
        }
    }, [editingBooking]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData({ ...bookingData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('auth_token');
            const method = editingBooking ? 'PUT' : 'POST';
            const url = editingBooking
                ? `http://127.0.0.1:8000/api/bookings/${editingBooking.id}`
                : 'http://127.0.0.1:8000/api/bookings';

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const result = await response.json();
            onAddOrUpdateBooking(result);
            setSuccess(true);

            // Reset form if adding new booking
            if (!editingBooking) {
                setBookingData({
                    name: '',
                    email: '',
                    phone: '',
                    service: '',
                    stylist: '',
                    room: '',
                    booking_date: '',
                    booking_time: '',
                    notes: '',
                });
            }

            setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {success && (
                <div className="alert alert-success alert-dismissible fade show">
                    <i className="bi bi-check-circle me-2"></i>
                    {editingBooking ? 'Booking updated successfully!' : 'Booking added successfully!'}
                </div>
            )}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Error: {error}
                </div>
            )}

            <div className="row g-3">
                <div className="col-12">
                    <label className="form-label">Customer Name *</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={bookingData.name}
                        onChange={handleInputChange} 
                        required 
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">Email *</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange} 
                        required 
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">Phone</label>
                    <input 
                        type="tel" 
                        className="form-control" 
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">Service *</label>
                    <select 
                        className="form-select" 
                        name="service"
                        value={bookingData.service}
                        onChange={handleInputChange} 
                        required
                    >
                        <option value="">Select a service</option>
                        {services.map(service => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12">
                    <label className="form-label">Stylist *</label>
                    <select 
                        className="form-select" 
                        name="stylist"
                        value={bookingData.stylist}
                        onChange={handleInputChange} 
                        required
                    >
                        <option value="">Select a stylist</option>
                        {stylists.map(stylist => (
                            <option key={stylist} value={stylist}>{stylist}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12">
                    <label className="form-label">Room *</label>
                    <select 
                        className="form-select" 
                        name="room"
                        value={bookingData.room}
                        onChange={handleInputChange} 
                        required
                    >
                        <option value="">Select a room</option>
                        {rooms.map(room => (
                            <option key={room} value={room}>{room}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Date *</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        name="booking_date"
                        value={bookingData.booking_date}
                        onChange={handleInputChange} 
                        required 
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Time *</label>
                    <input 
                        type="time" 
                        className="form-control" 
                        name="booking_time"
                        value={bookingData.booking_time}
                        onChange={handleInputChange} 
                        required 
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">Notes</label>
                    <textarea 
                        className="form-control" 
                        name="notes"
                        value={bookingData.notes}
                        onChange={handleInputChange} 
                        rows="3"
                        placeholder="Special requests or notes..."
                    />
                </div>

                <div className="col-12">
                    <div className="d-grid gap-2">
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Processing...
                                </>
                            ) : (
                                editingBooking ? 'Update Booking' : 'Add Booking'
                            )}
                        </button>
                        
                        {editingBooking && (
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={onCancelEdit}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ServicesManagement;