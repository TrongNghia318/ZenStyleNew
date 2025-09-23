import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setErrors({ form: "Please enter email and password" });
      return;
    }
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("token", data.token);

        // Lấy role của người dùng từ response
        const userRole = data.user.role;

        // Kiểm tra vai trò và chuyển hướng
        if (userRole === 'admin') {
          navigate("/dashboard"); // Chuyển hướng đến trang dashboard cho admin
        } else {
          navigate("/"); // Chuyển hướng đến trang Home cho các role khác
        }
      } else {
        setErrors({ api: data.message || "Đăng nhập thất bại" });
        alert(data.message || "Sai thông tin đăng nhập");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      alert("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card card p-4 p-md-5">
        <h2 className="mb-4">Log in</h2>
        {errors.api && <div className="alert alert-danger">{errors.api}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={change}
            />
          </div>

          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={change}
            />
          </div>

          {errors.form && <div className="text-danger">{errors.form}</div>}

          <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="text-center mt-3">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}