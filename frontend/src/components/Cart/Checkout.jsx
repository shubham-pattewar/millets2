import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import { toast } from 'react-toastify';
import './Cart.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'QR',
    transactionId: ''
  });

  const taxRate = 0.05; // 5% tax
  const shippingCharge = 50;
  const taxPrice = cartTotal * taxRate;
  const totalPrice = cartTotal + taxPrice + shippingCharge;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentInfo.transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    try {
      setLoading(true);

      // Group items by seller
      const itemsBySeller = {};
      cartItems.forEach(item => {
        const sellerId = item.seller;
        if (!itemsBySeller[sellerId]) {
          itemsBySeller[sellerId] = [];
        }
        itemsBySeller[sellerId].push({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
          image: item.images[0]?.url,
          milletType: item.milletType,
          seller: sellerId
        });
      });

      // Create order for each seller
      const orderPromises = Object.entries(itemsBySeller).map(([sellerId, items]) => {
        const itemsPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return api.post('/orders', {
          orderItems: items,
          shippingAddress,
          paymentInfo: {
            ...paymentInfo,
            status: 'completed',
            paidAt: new Date()
          },
          itemsPrice,
          taxPrice: itemsPrice * taxRate,
          shippingPrice: shippingCharge,
          totalPrice: itemsPrice + (itemsPrice * taxRate) + shippingCharge
        });
      });

      const results = await Promise.all(orderPromises);
      
      if (results[0]?.data?.success) {
        setOrderId(results[0].data.order.orderNumber);
        clearCart();
        setStep(3);
        toast.success('Order placed successfully!');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-container">
      <div className="container">
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Address</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Payment</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirm</span>
          </div>
        </div>

        {step === 1 && (
          <div className="checkout-content">
            <div className="checkout-main">
              <h2>Shipping Address</h2>
              <form onSubmit={handleAddressSubmit} className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      required
                      pattern="[0-9]{10}"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                      required
                      pattern="[0-9]{6}"
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  Continue to Payment
                </button>
              </form>
            </div>

            <div className="checkout-sidebar">
              <h3>Order Summary</h3>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item._id} className="summary-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (5%)</span>
                  <span>{formatPrice(taxPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingCharge)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-content">
            <div className="checkout-main">
              <h2>Payment</h2>
              <div className="payment-section">
                <div className="qr-code-section">
                  <h3>Scan QR Code to Pay</h3>
                  <p>Amount: {formatPrice(totalPrice)}</p>
                  <div className="qr-code-wrapper">
                    <QRCodeSVG
                      value={`upi://pay?pa=merchant@upi&pn=MilletsHub&am=${totalPrice}&cu=INR`}
                      size={200}
                      level="H"
                    />
                  </div>
                  <p className="qr-hint">Scan with any UPI app to pay</p>
                </div>

                <form onSubmit={handlePaymentSubmit} className="payment-form">
                  <div className="form-group">
                    <label>Transaction ID *</label>
                    <input
                      type="text"
                      value={paymentInfo.transactionId}
                      onChange={(e) => setPaymentInfo({...paymentInfo, transactionId: e.target.value})}
                      required
                      placeholder="Enter UPI transaction ID"
                      className="form-input"
                    />
                    <small>Enter the transaction ID after making the payment</small>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-outline"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Confirm Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="checkout-sidebar">
              <h3>Shipping Address</h3>
              <div className="address-display">
                <p><strong>{shippingAddress.name}</strong></p>
                <p>{shippingAddress.phone}</p>
                <p>{shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.state}</p>
                <p>{shippingAddress.pincode}</p>
              </div>
              <button onClick={() => setStep(1)} className="btn btn-outline btn-small">
                Edit Address
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="success-container">
            <div className="success-icon">
              <FaCheckCircle size={80} color="#4CAF50" />
            </div>
            <h1>Order Placed Successfully!</h1>
            <p>Your order number is: <strong>{orderId}</strong></p>
            <p>We'll send you updates about your order via email and SMS.</p>
            <div className="success-actions">
              <button
                onClick={() => navigate('/customer/dashboard')}
                className="btn btn-primary"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="btn btn-outline"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;