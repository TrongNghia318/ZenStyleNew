import React from "react";
import BookingForm from "../../components/BookingForm"; // Thay đổi đường dẫn nếu cần

export default function Makeup() {
    return (
        <>
            <div className="container-fluid bg-light page-header py-5 mb-5">
                <div className="container text-center py-5">
                    <h1 className="display-1">Makeup</h1>
                </div>
            </div>

            {/* Sử dụng component form và truyền tên dịch vụ vào */}
            <BookingForm serviceName="Makeup" />
        </>
    );
}