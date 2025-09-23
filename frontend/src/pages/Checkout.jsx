import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./css/Checkout.module.css";
import { useRef } from "react";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle both single product and cart checkout
  const { product: initialProduct, quantity, cartItems } = location.state || {};
  
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const authChecked = useRef(false);

  // Check authentication
  useEffect(() => {
    if (authChecked.current) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      authChecked.current = true;
      alert("You need to login to checkout!");
      navigate("/login");
      return;
    }
    authChecked.current = true;
  }, [navigate]);

  // Process order items
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // Cart checkout - multiple items
      const items = cartItems.map(item => ({
        item_id: item.inventory.item_id,
        name: item.inventory.name,
        unit_price: item.inventory.unit_price,
        quantity: item.quantity,
        images: item.inventory.images,
        image_url: item.inventory.image_url
      }));
      setOrderItems(items);
    } else if (initialProduct && quantity) {
      // Direct product checkout - single item
      setOrderItems([{
        item_id: initialProduct.item_id,
        name: initialProduct.name,
        unit_price: initialProduct.unit_price,
        quantity: quantity,
        images: initialProduct.images,
        image_url: initialProduct.image_url
      }]);
    }
  }, [cartItems, initialProduct, quantity]);

  // Show error if no items
  if (orderItems.length === 0) {
    return (
      <div className={styles.checkoutWrapper}>
        <p>No items to checkout!</p>
        <button onClick={() => navigate("/products")}>Back to Products</button>
      </div>
    );
  }

  // Calculate total
  const totalAmount = orderItems.reduce((total, item) => 
    total + (item.unit_price * item.quantity), 0
  );

  const handleConfirmPayment = async () => {
    if (!email) {
      setMessage("Please enter email to receive invoice");
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert("Session expired!");
      navigate("/login");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Format items for API
      const apiItems = orderItems.map(item => ({
        item_id: item.item_id,
        quantity: item.quantity,
        price: item.unit_price
      }));

      const response = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          items: apiItems,
          payment_method: "cash",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Order successfully created! Order ID: " + data.order.order_id);
        
        // Clear cart if this was a cart checkout
        if (cartItems && cartItems.length > 0) {
          try {
            await fetch("http://127.0.0.1:8000/api/cart/clear", {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });
          } catch (err) {
            console.error("Error clearing cart:", err);
          }
        }
        
        setTimeout(() => navigate("/products"), 2000);
      } else {
        setMessage("Error: " + (data.message || "Something went wrong"));
      }
    } catch (err) {
      console.error(err);
      setMessage("Error: Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutWrapper}>
      <h1>Confirm Order</h1>
      
      {/* Order Summary */}
      <div className={styles.checkoutContainer}>
        <div className={styles.orderSummary}>
          <h3>Order Summary</h3>
          
          {orderItems.map((item, index) => {
            const itemImage = item.images && item.images.length > 0
              ? item.images[0].url
              : item.image_url || "/assets/img/default.jpg";
              
            return (
              <div key={index} className={styles.orderItem}>
                <img src={itemImage} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h4>{item.name}</h4>
                  <p>Price: ${item.unit_price} USD</p>
                  <p>Quantity: {item.quantity}</p>
                  <p><strong>Subtotal: ${(item.unit_price * item.quantity).toFixed(2)} USD</strong></p>
                </div>
              </div>
            );
          })}
          
          <div className={styles.totalAmount}>
            <h3>Total: ${totalAmount.toFixed(2)} USD</h3>
          </div>
        </div>

        {/* Payment Form */}
        <div className={styles.checkoutInfo}>
          <h3>Payment Details</h3>
          
          <div style={{ marginBottom: "20px" }}>
            <label>Email for invoice:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ 
                width: "100%", 
                padding: "10px", 
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p><strong>Payment Method:</strong> Cash on Delivery</p>
          </div>

          <button
            className={styles.btn}
            onClick={handleConfirmPayment}
            disabled={loading}
          >
            {loading ? "Processing..." : `Confirm Payment - $${totalAmount.toFixed(2)}`}
          </button>
          
          {message && <p className={styles.checkoutMessage}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Checkout;