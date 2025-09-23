import { useState } from "react";
import { Link } from "react-router-dom";
import "./css/auth.css";

const COUNTRIES = [
  { code: "VN", dial: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "US", dial: "+1",  name: "United States", flag: "🇺🇸" },
  { code: "JP", dial: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "KR", dial: "+82", name: "Korea", flag: "🇰🇷" },
];

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "",
    country: COUNTRIES[0], // default VN +84
  });
  const [showPass, setShowPass] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectCountry = (c) => {
    setForm({ ...form, country: c });
    setOpenCountry(false);
  };

  const validate = () => {
    const err = {};
    if (!form.firstName) err.firstName = "Please enter first name";
    if (!form.lastName)  err.lastName  = "Please enter last name";
    if (!form.phone)     err.phone     = "Please enter phone";
    else if (!/^\d{6,15}$/.test(form.phone.replace(/\D/g, "")))
      err.phone = "Invalid phone";
    if (!form.email)     err.email     = "Please enter email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      err.email = "Invalid email";
    if (!form.password)  err.password  = "Please enter password";
    else if (form.password.length < 6)
      err.password = "At least 6 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      console.log("Signup payload (frontend demo):", {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
        phone: `${form.country.dial}${form.phone}`,
        country: form.country.code,
      });
      setLoading(false);
      alert("Submitted! (Frontend demo)");
    }, 600);
  };

  return (
    <div className="container py-5">
      <div className="auth-card card p-4 p-md-5">
        <h2 className="mb-4">Create an account</h2>

        <form onSubmit={submit} noValidate>
          {/* First / Last name */}
          <div className="row g-3">
            <div className="col-md-6">
              <input
                name="firstName"
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                placeholder="First name"
                value={form.firstName}
                onChange={change}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>
            <div className="col-md-6">
              <input
                name="lastName"
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                placeholder="Last name"
                value={form.lastName}
                onChange={change}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>
          </div>

          {/* Phone with country */}
          <div className="mt-3 position-relative">
            <div className="input-group auth-phone">
              <button
                type="button"
                className="btn btn-light auth-flag-btn"
                onClick={() => setOpenCountry((o) => !o)}
                aria-label="Select country"
              >
                <span className="me-1">{form.country.flag}</span>
                <i className={`bi bi-caret-${openCountry ? "up" : "down"}-fill`} />
              </button>
              <span className="input-group-text auth-dial">{form.country.dial}</span>
              <input
                name="phone"
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Phone"
                value={form.phone}
                onChange={change}
                inputMode="numeric"
              />
            </div>

            {/* country dropdown */}
            {openCountry && (
              <ul className="auth-country-menu list-unstyled shadow">
                {COUNTRIES.map((c) => (
                  <li key={c.code}>
                    <button type="button" onClick={() => selectCountry(c)}>
                      <span className="me-2">{c.flag}</span> {c.name}
                      <span className="text-muted ms-2">{c.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
          </div>

          {/* Email */}
          <div className="mt-3">
            <input
              name="email"
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Email"
              value={form.email}
              onChange={change}
              autoComplete="username"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Password + eye */}
          <div className="mt-3 position-relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              value={form.password}
              onChange={change}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="btn btn-link auth-eye"
              onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`} />
            </button>
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>

          <button className="btn btn-primary w-100 mt-4 py-2" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <div className="text-center mt-3">
            Already have an account? <Link to="/login">Log in</Link>
          </div>

          <p className="small text-muted mt-3 mb-0">
            By logging in or signing up, you give your <a href="#!">Consent to personal data processing</a> and
            confirm that you have read the <a href="#!">Online booking rules</a> and <a href="#!">Privacy policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
