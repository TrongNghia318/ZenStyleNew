import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 🚩 Demo login (bạn thay bằng API thật nếu có)
        if (form.username === "admin" && form.password === "123456") {
            localStorage.setItem("adminToken", "fake_token"); // lưu token giả
            navigate("/dashboard"); // chuyển hướng vào dashboard
        } else {
            setError("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">Admin Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
