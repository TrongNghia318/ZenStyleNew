import React, { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000/api/bookings";

// Stylist data for each service
const serviceStylists = {
    "Haircut": ["Straight short hair.", "Shoulder-length haircut.", "Korean layered short hair"],
    "Makeup": ["No Makeup Makeup", "Bold Makeup", "Smoky Eye Makeup"],
    "Manicure": ["Gel Manicure", "Acrylic Manicure", "Press-On Nails"],
    "Pedicure": [" Hot Stones Pedicure", "Paraffin Pedicure", "French Pedicure"],
    "Massage": ["Swedish Massage", "Reflexology", "Craniosacral Therapy"],
    "SkinCare": ["Jessica", "Olivia", "Sophia"],
};

export default function BookingForm({ serviceName }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: serviceName,
        booking_date: "",
        booking_time: "",
        stylist: "",
        room: "",
        notes: "",
    });

    // Add state to store existing bookings
    const [existingBookings, setExistingBookings] = useState([]);

    const rooms = ["Room 1", "Room 2", "Room 3", "Room 4"];

    // Get the list of stylists based on serviceName
    const currentStylists = serviceStylists[serviceName] || [];

    useEffect(() => {
        // Update service and reset stylist when serviceName changes
        setFormData(prev => ({
            ...prev,
            service: serviceName,
            stylist: ""
        }));
    }, [serviceName]);

    // Add useEffect to load bookings when the date changes
    useEffect(() => {
        if (formData.booking_date) {
            // Load bookings for the selected date from the API
            const fetchBookings = async () => {
                try {
                    // Note: Your backend API needs to support filtering by date
                    const response = await fetch(`${API}?booking_date=${formData.booking_date}`);
                    if (response.ok) {
                        const data = await response.json();
                        setExistingBookings(data);
                    }
                } catch (error) {
                    console.error("Error fetching bookings:", error);
                }
            };
            fetchBookings();
        }
    }, [formData.booking_date]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // New function: check for conflicts
    const isConflict = (newBooking) => {
        return existingBookings.some(booking =>
            booking.booking_date === newBooking.booking_date &&
            booking.booking_time === newBooking.booking_time &&
            (booking.stylist === newBooking.stylist || booking.room === newBooking.room)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Step 1: Check for conflicts before submitting
        if (isConflict(formData)) {
            alert("Sorry, this appointment slot is already taken. Please choose a different time, stylist, or room.");
            return; // Stop the form submission
        }

        try {
            const response = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Your appointment has been booked successfully!");
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    service: serviceName,
                    booking_date: "",
                    booking_time: "",
                    stylist: "",
                    room: "",
                    notes: "",
                });
            } else {
                const errorText = await response.text();
                alert("An error occurred: " + errorText);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Connection error. Please try again.");
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                {/* Name and Email */}
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                                        <label htmlFor="name">Your Name</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="email" className="form-control" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                                        <label htmlFor="email">Your Email</label>
                                    </div>
                                </div>
                                {/* Phone */}
                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="tel" className="form-control" id="phone" placeholder="Your Phone Number" value={formData.phone} onChange={handleChange} />
                                        <label htmlFor="phone">Your Phone Number</label>
                                    </div>
                                </div>
                                {/* Service */}
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="service" value={formData.service} readOnly />
                                        <label htmlFor="service">Service</label>
                                    </div>
                                </div>

                                {/* Stylist Select */}
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select className="form-control" id="stylist" value={formData.stylist} onChange={handleChange} required>
                                            <option value="" disabled>Select a Stylist</option>
                                            {currentStylists.map((stylist, index) => (
                                                <option key={index} value={stylist}>{stylist}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="stylist">Select Stylist</label>
                                    </div>
                                </div>

                                {/* Room Select */}
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select className="form-control" id="room" value={formData.room} onChange={handleChange} required>
                                            <option value="" disabled>Select a Room</option>
                                            {rooms.map((room, index) => (
                                                <option key={index} value={room}>{room}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="room">Select Room</label>
                                    </div>
                                </div>

                                {/* Date and Time */}
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="date" className="form-control" id="booking_date" value={formData.booking_date} onChange={handleChange} required />
                                        <label htmlFor="booking_date">Appointment Date</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="time" className="form-control" id="booking_time" value={formData.booking_time} onChange={handleChange} required />
                                        <label htmlFor="booking_time">Appointment Time</label>
                                    </div>
                                </div>
                                {/* Notes */}
                                <div className="col-12">
                                    <div className="form-floating">
                                        <textarea className="form-control" id="notes" style={{ height: 100 }} value={formData.notes} onChange={handleChange}></textarea>
                                        <label htmlFor="notes">Notes or Requests</label>
                                    </div>
                                </div>

                                <div className="col-12 text-center">
                                    <button className="btn btn-primary py-3 px-5" type="submit">Book Appointment</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}