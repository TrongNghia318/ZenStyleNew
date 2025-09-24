import React, { useState, useEffect } from 'react';
import BookingForm from '../../components/Dashboard/BookingForm';

function ServicesPage() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/bookings');
                if (!response.ok) throw new Error('Không thể lấy dữ liệu.');
                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleAddOrUpdateBooking = (updatedBooking) => {
        if (editingBooking) {
            setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        } else {
            setBookings([updatedBooking, ...bookings]);
        }
        setEditingBooking(null);
    };

    const handleDeleteBooking = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này không?')) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/bookings/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Xóa lịch hẹn thất bại.');
                setBookings(bookings.filter(b => b.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleEditClick = (booking) => setEditingBooking(booking);
    const handleCancelEdit = () => setEditingBooking(null);

    const formatTimeWithPeriod = (timeString) => {
        if (!timeString) return '';
        const hour = parseInt(timeString.split(':')[0], 10);
        let period = '';
        if (hour >= 6 && hour < 12) period = 'sáng';
        else if (hour >= 12 && hour < 18) period = 'chiều';
        else period = 'tối';
        const formattedTime = timeString.replace(/:00$/, '');
        return `${formattedTime} (${period})`;
    };

    if (isLoading) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
    if (error) return <div className="alert alert-danger mt-5">Lỗi: {error}</div>;

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-5">Quản lý dịch vụ</h1>

            <div className="row">
                {/* Form bên trái */}
                <div className="col-12 col-lg-4 mb-4">
                    <div className="card shadow-sm p-4 h-100">
                        <h4 className="card-title mb-3">
                            {editingBooking ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                        </h4>
                        <BookingForm
                            onAddOrUpdateBooking={handleAddOrUpdateBooking}
                            editingBooking={editingBooking}
                            onCancelEdit={handleCancelEdit}
                        />
                    </div>
                </div>

                {/* Bảng bên phải full width */}
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm p-4 h-100">
                        <h4 className="card-title mb-4">Danh sách dịch vụ</h4>
                        {/* Thêm scroll ngang */}
                        <div className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <table className="table table-bordered table-hover text-center align-middle mb-0" style={{ minWidth: '1200px' }}>
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên</th>
                                        <th>Email</th>
                                        <th>SĐT</th>
                                        <th>Dịch vụ</th>
                                        <th>Stylist</th>
                                        <th>Phòng</th>
                                        <th>Ngày</th>
                                        <th>Giờ</th>
                                        <th>Ghi chú</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length > 0 ? (
                                        bookings.map(b => (
                                            <tr key={b.id}>
                                                <td>{b.id}</td>
                                                <td>{b.name}</td>
                                                <td>{b.email}</td>
                                                <td>{b.phone}</td>
                                                <td>{b.service}</td>
                                                <td>{b.stylist}</td>
                                                <td>{b.room}</td>
                                                <td>{b.booking_date}</td>
                                                <td>{formatTimeWithPeriod(b.booking_time)}</td>
                                                <td>{b.notes}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-warning me-2"
                                                        onClick={() => handleEditClick(b)}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteBooking(b.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="text-center text-muted">
                                                Chưa có lịch hẹn nào.
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
    );
}

export default ServicesPage;
