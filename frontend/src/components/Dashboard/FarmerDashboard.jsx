import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaRupeeSign, FaShoppingBag, FaClock, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import './Dashboard.css';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalEarnings: 0,
    pendingOrders: 0
  });
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products/seller/my-products'),
        api.get('/orders/seller-orders')
      ]);

      const myProducts = productsRes.data.products;
      const myOrders = ordersRes.data.orders;

      setProducts(myProducts);
      setRecentOrders(myOrders.slice(0, 5));

      const pendingOrdersCount = myOrders.filter(o => o.orderStatus === 'pending').length;
      const deliveredOrders = myOrders.filter(o => o.orderStatus === 'delivered');
      const totalEarnings = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0);

      setStats({
        totalProducts: myProducts.length,
        totalOrders: myOrders.length,
        totalEarnings: totalEarnings,
        pendingOrders: pendingOrdersCount
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
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
            <h1>Welcome, {user?.name}! 🌾</h1>
            <p>Manage your products and orders from here</p>
          </div>
          <Link to="/upload-product" className="btn btn-primary">
            <FaPlus /> Upload New Product
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E3F2FD' }}>
              <FaBoxOpen style={{ color: '#2196F3' }} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E8F5E9' }}>
              <FaShoppingBag style={{ color: '#4CAF50' }} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FFF3E0' }}>
              <FaRupeeSign style={{ color: '#FF9800' }} />
            </div>
            <div className="stat-content">
              <h3>{formatPrice(stats.totalEarnings)}</h3>
              <p>Total Earnings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FCE4EC' }}>
              <FaClock style={{ color: '#E91E63' }} />
            </div>
            <div className="stat-content">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Products</h2>
              <Link to="/upload-product" className="link-primary">View All</Link>
            </div>
            <div className="products-table">
              {products.length === 0 ? (
                <div className="empty-state">
                  <p>No products uploaded yet</p>
                  <Link to="/upload-product" className="btn btn-primary">
                    <FaPlus /> Upload Your First Product
                  </Link>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map(product => (
                      <tr key={product._id}>
                        <td>
                          <div className="product-cell">
                            <img 
                              src={product.images[0]?.url || '/placeholder.png'} 
                              alt={product.name}
                              className="product-thumbnail"
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{formatPrice(product.price)}/{product.unit}</td>
                        <td>{product.quantity} {product.unit}</td>
                        <td>
                          {product.verificationStatus === 'approved' && (
                            <span className="badge badge-success">Verified</span>
                          )}
                          {product.verificationStatus === 'pending' && (
                            <span className="badge badge-warning">Pending</span>
                          )}
                          {product.verificationStatus === 'rejected' && (
                            <span className="badge badge-error">Rejected</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/product/${product._id}`} className="action-btn" title="View">
                              <FaEye />
                            </Link>
                            <button className="action-btn" title="Edit">
                              <FaEdit />
                            </button>
                            <button 
                              className="action-btn danger" 
                              title="Delete"
                              onClick={() => handleDeleteProduct(product._id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/farmer/orders" className="link-primary">View All</Link>
            </div>
            <div className="orders-list">
              {recentOrders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders received yet</p>
                </div>
              ) : (
                recentOrders.map(order => (
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
                      <p><strong>Buyer:</strong> {order.buyer?.name}</p>
                      <p><strong>Items:</strong> {order.orderItems.length}</p>
                      <p><strong>Total:</strong> {formatPrice(order.totalPrice)}</p>
                    </div>
                    <Link to={`/order/${order._id}`} className="btn btn-outline btn-small">
                      View Details
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;