import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaHeart, FaBox, FaStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import { formatPrice, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { wishlistItems, cartCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name}! 🛒</h1>
            <p>Your personalized shopping dashboard</p>
          </div>
          <Link to="/marketplace" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E3F2FD' }}>
              <FaShoppingBag style={{ color: '#2196F3' }} />
            </div>
            <div className="stat-content">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E8F5E9' }}>
              <FaBox style={{ color: '#4CAF50' }} />
            </div>
            <div className="stat-content">
              <h3>{cartCount}</h3>
              <p>Items in Cart</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FFF3E0' }}>
              <FaHeart style={{ color: '#FF9800' }} />
            </div>
            <div className="stat-content">
              <h3>{wishlistItems.length}</h3>
              <p>Wishlist Items</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FCE4EC' }}>
              <FaStar style={{ color: '#E91E63' }} />
            </div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Reviews Written</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/orders" className="link-primary">View All</Link>
            </div>
            <div className="orders-list">
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet</p>
                  <Link to="/marketplace" className="btn btn-primary">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.slice(0, 5).map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <span className="order-number">#{order.orderNumber}</span>
                      <span className={`badge badge-${
                        order.orderStatus === 'delivered' ? 'success' :
                        order.orderStatus === 'pending' ? 'warning' : 'info'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="order-details">
                      <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                      <p><strong>Items:</strong> {order.orderItems.length}</p>
                      <p><strong>Total:</strong> {formatPrice(order.totalPrice)}</p>
                    </div>
                    <div className="order-actions">
                      <Link to={`/order/${order._id}`} className="btn btn-outline btn-small">
                        View Details
                      </Link>
                      {order.orderStatus === 'delivered' && !order.isRated && (
                        <button className="btn btn-primary btn-small">
                          Rate Product
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <Link to="/cart" className="action-card">
                <FaShoppingBag />
                <h4>My Cart</h4>
                <p>{cartCount} items</p>
              </Link>
              <Link to="/wishlist" className="action-card">
                <FaHeart />
                <h4>Wishlist</h4>
                <p>{wishlistItems.length} items</p>
              </Link>
              <Link to="/marketplace" className="action-card">
                <FaBox />
                <h4>Shop Now</h4>
                <p>Browse products</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;