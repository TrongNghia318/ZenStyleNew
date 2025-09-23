import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import CartModal from "../pages/CartModal";


export default function Nav() {
  const [open, setOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false); // Add cart modal state
  const { isAuthenticated, user, userType, logout, isClient } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <>
      <div className="container-fluid bg-light sticky-top p-0">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <Link to="/" className="navbar-brand bg-primary py-4 px-5 me-0">
            <h1 className="mb-0"><i className="bi bi-scissors"></i>ZenStyle</h1>
          </Link>

          <div className="navbar-nav mx-auto"></div>

          <div className="d-flex ms-lg-3 gap-2">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                {/* Add Cart button for clients */}
                {isClient && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowCartModal(true)}
                  >
                    <i className="fas fa-shopping-cart" style={{ fontSize: '18px' }}></i>
                  </button>
                )}

                <span style={{ color: '#0056b3', fontWeight: 'bold' }}>
                  Hello, {user?.name} {userType === 'user' && `(${user?.role})`}
                </span>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-primary">Log in</Link>
            )}
          </div>

          <button type="button" className="navbar-toggler me-4" onClick={() => setOpen(!open)}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse p-3 ${open ? "show" : ""}`}>
            <div className="navbar-nav mx-auto">
              <NavLink to="/" end className="nav-item nav-link">Home</NavLink>
              <NavLink to="/services" className="nav-item nav-link">Service</NavLink>
              <NavLink to="/products" className="nav-item nav-link">Product</NavLink>
              <NavLink to="/price" className="nav-item nav-link">Price</NavLink>
              <NavLink to="/contact" className="nav-item nav-link">Contact</NavLink>
            </div>
            <div className="d-flex">
              <a className="btn btn-primary btn-sm-square me-3" href="#"><i className="fab fa-facebook-f"></i></a>
              <a className="btn btn-primary btn-sm-square me-3" href="#"><i className="fab fa-instagram"></i></a>
              <a className="btn btn-primary btn-sm-square" href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </nav>
      </div>

      {/* Add the Cart Modal */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </>
  );
}