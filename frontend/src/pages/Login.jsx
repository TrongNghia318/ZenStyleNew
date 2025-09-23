import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/auth.css";

export default function Login() {
  const [tab, setTab] = useState("email");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (tab === "email") {
      if (!form.email) err.email = "Please enter email";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Invalid email";
    } else {
      if (!form.phone) err.phone = "Please enter phone";
      else if (!/^\+?\d{8,15}$/.test(form.phone)) err.phone = "Invalid phone";
    }
    if (!form.password) err.password = "Please enter password";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Try login with both User and Client APIs
  const attemptLogin = async (apiEndpoint, loginData, userType) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data, userType };
      } else {
        return { success: false, status: response.status, message: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const loginData = tab === "email"
        ? { email: form.email, password: form.password }
        : { phone: form.phone, password: form.password };

      // Try Client login first
      const clientResult = await attemptLogin(
        'http://127.0.0.1:8000/api/client/login',
        loginData,
        'client'
      );

      if (clientResult.success) {
        localStorage.setItem('auth_token', clientResult.data.access_token);
        localStorage.setItem('user_type', 'client');
        localStorage.setItem('client_data', JSON.stringify(clientResult.data.client));

        // Trigger auth change event
        window.dispatchEvent(new Event('auth-change'));

        alert(`Chào mừng khách hàng: ${clientResult.data.client.name}!`);
        navigate("/"); // dùng navigate thay cho window.location.href
        return;
      }


      // If Client login fails, try User login
      const userResult = await attemptLogin(
        'http://127.0.0.1:8000/api/user/login',
        loginData,
        'user'
      );

      if (userResult.success) {
        localStorage.setItem('auth_token', userResult.data.access_token);
        localStorage.setItem('user_type', 'user');
        localStorage.setItem('user_data', JSON.stringify(userResult.data.user));

        window.dispatchEvent(new Event('auth-change'));

        alert(`Chào mừng nhân viên: ${userResult.data.user.name} (${userResult.data.user.role})!`);
        navigate("/"); // Cũng nên đổi từ window.location.href
        return;
      }

      // Both failed - show error
      if (clientResult.status === 401 && userResult.status === 401) {
        setErrors({ general: "Email/Phone hoặc mật khẩu không đúng" });
      } else if (clientResult.error || userResult.error) {
        setErrors({ general: "Lỗi kết nối. Vui lòng thử lại." });
      } else {
        setErrors({ general: "Đăng nhập thất bại" });
      }

    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Lỗi hệ thống. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container py-5">
      <div className="auth-card card p-4 p-md-5">
        <h2 className="mb-4">Log in to your account</h2>

        {errors.general && (
          <div className="alert alert-danger">
            {errors.general}
          </div>
        )}

        <div className="auth-tabs mb-3">
          <button
            type="button"
            className={tab === "email" ? "active" : ""}
            onClick={() => setTab("email")}
          >
            Email
          </button>
          <button
            type="button"
            className={tab === "phone" ? "active" : ""}
            onClick={() => setTab("phone")}
          >
            Phone
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          {tab === "email" ? (
            <div className="mb-3">
              <input
                name="email"
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                autoComplete="username"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          ) : (
            <div className="mb-3">
              <input
                name="phone"
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Phone"
                value={form.phone}
                onChange={onChange}
                autoComplete="tel"
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          )}

          <div className="mb-3 position-relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="btn btn-link auth-eye"
              onClick={() => setShowPass((s) => !s)}
            >
              <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`} />
            </button>
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>

          <div className="d-flex justify-content-between mb-3">
            <Link to="/signup" className="text-decoration-none">Sign up</Link>
            <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
          </div>

          <button className="btn btn-primary w-100 py-2" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="text-center my-3">
            <small className="text-muted">
              Hệ thống tự động phân biệt tài khoản khách hàng và nhân viên
            </small>
          </div>

          <p className="small text-muted mb-0">
            By logging in or signing up, you give your <a href="#!">Consent to personal data processing</a> and
            confirm that you have read the <a href="#!">Online booking rules</a> and <a href="#!">Privacy policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}