import React, { useState, useEffect } from 'react';

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
            const method = editingBooking ? 'PUT' : 'POST';
            const url = editingBooking
                ? `http://127.0.0.1:8000/api/bookings/${editingBooking.id}`
                : 'http://127.0.0.1:8000/api/bookings';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            const responseData = await response.text();

            if (!response.ok) {
                let errorDetails = `Error: ${response.status} ${response.statusText}.`;
                try {
                    const errorData = JSON.parse(responseData);
                    errorDetails += ` Details: ${JSON.stringify(errorData)}`;
                } catch {
                    errorDetails += ` Response: ${responseData.substring(0, 100)}...`;
                }
                throw new Error(errorDetails);
            }

            const result = JSON.parse(responseData);

            onAddOrUpdateBooking(result);
            setSuccess(true);

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
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {success && (
                <div className="alert alert-success">
                    {editingBooking ? 'Update successful!' : 'Added successfully!'}
                </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="name" name="name"
                            placeholder="Name" value={bookingData.name}
                            onChange={handleInputChange} required />
                        <label htmlFor="name">Name</label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating">
                        <input type="email" className="form-control" id="email" name="email"
                            placeholder="Email" value={bookingData.email}
                            onChange={handleInputChange} required />
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating">
                        <input type="tel" className="form-control" id="phone" name="phone"
                            placeholder="Phone" value={bookingData.phone}
                            onChange={handleInputChange} required />
                        <label htmlFor="phone">Phone</label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="service" name="service"
                            placeholder="Service" value={bookingData.service}
                            onChange={handleInputChange} required />
                        <label htmlFor="service">Service</label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="stylist" name="stylist"
                            placeholder="Stylist" value={bookingData.stylist}
                            onChange={handleInputChange} required />
                        <label htmlFor="stylist">Stylist</label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="room" name="room"
                            placeholder="Room" value={bookingData.room}
                            onChange={handleInputChange} required />
                        <label htmlFor="room">Room</label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating">
                        <input type="date" className="form-control" id="booking_date" name="booking_date"
                            placeholder="Booking Date" value={bookingData.booking_date}
                            onChange={handleInputChange} required />
                        <label htmlFor="booking_date">Date</label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating">
                        <input type="time" className="form-control" id="booking_time" name="booking_time"
                            placeholder="Booking Time" value={bookingData.booking_time}
                            onChange={handleInputChange} required />
                        <label htmlFor="booking_time">Time</label>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-floating">
                        <textarea className="form-control" id="notes" name="notes"
                            placeholder="Notes" value={bookingData.notes}
                            onChange={handleInputChange} style={{ height: '100px' }} />
                        <label htmlFor="notes">Notes</label>
                    </div>
                </div>

                <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary py-3 px-5 mt-4" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : (editingBooking ? 'Update Booking' : 'Add Booking')}
                    </button>
                    {editingBooking && (
                        <button type="button" className="btn btn-secondary py-3 px-5 mt-4 ms-2"
                            onClick={onCancelEdit}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}

export default BookingForm;