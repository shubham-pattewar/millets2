import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingBag size={80} color="#CCC" />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/marketplace" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="btn btn-outline btn-small">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img 
                  src={getImageUrl(item.images[0]?.url)} 
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <Link to={`/product/${item._id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <p className="cart-item-type">{item.milletType}</p>
                  <p className="cart-item-price">
                    {formatPrice(item.price)} / {item.unit}
                  </p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="remove-btn"
                  title="Remove from cart"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-large"
            >
              Proceed to Checkout
            </button>

            <Link to="/marketplace" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;