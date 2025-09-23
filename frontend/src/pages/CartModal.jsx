import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../pages/css/ProductDetail.module.css';

export default function CartModal({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://127.0.0.1:8000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart_items);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://127.0.0.1:8000/api/cart/${cartId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (cartId) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://127.0.0.1:8000/api/cart/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => 
      total + (item.inventory.unit_price * item.quantity), 0
    );
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout', { state: { cartItems } });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Shopping Cart</h3>
          <button onClick={onClose} className={styles.modalCloseBtn}>×</button>
        </div>

        <div className={styles.modalContent}>
          {loading ? (
            <div className={styles.loadingText}>Loading cart...</div>
          ) : cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
              <button 
                onClick={() => { onClose(); navigate('/products'); }} 
                className={styles.continueShoppingBtn}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className={styles.cartItemsList}>
                {cartItems.map(item => (
                  <div key={item.cart_id} className={styles.cartItem}>
                    <img 
                      src={
                        item.inventory.images?.[0]?.url || 
                        (item.inventory.images?.[0]?.path ? `http://127.0.0.1:8000/storage/${item.inventory.images[0].path}` : null) ||
                        (item.inventory.image ? `http://127.0.0.1:8000/storage/${item.inventory.image}` : null) ||
                        '/assets/img/default.jpg'
                      }
                      alt={item.inventory.name}
                      className={styles.cartItemImage}
                    />
                    <div className={styles.cartItemDetails}>
                      <h5 className={styles.cartItemName}>{item.inventory.name}</h5>
                      <p className={styles.cartItemPrice}>${item.inventory.unit_price}</p>
                    </div>
                    <div className={styles.cartItemControls}>
                      <button 
                        onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className={styles.quantityBtn}
                      >-</button>
                      <span className={styles.quantityDisplay}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                        className={styles.quantityBtn}
                      >+</button>
                      <button 
                        onClick={() => removeItem(item.cart_id)}
                        className={styles.removeBtn}
                      >Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.cartSummary}>
                <div className={styles.cartTotal}>
                  <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
                </div>
                <button 
                  onClick={handleCheckout}
                  className={styles.checkoutBtn}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}