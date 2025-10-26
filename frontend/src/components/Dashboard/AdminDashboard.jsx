import React, { useState, useEffect } from 'react';
import { FaUsers, FaBoxOpen, FaShoppingBag, FaRupeeSign, FaCheckCircle, FaClock } from 'react-icons/fa';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import './Dashboard.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, productsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/products/pending')
      ]);

      setAnalytics(analyticsRes.data.analytics);
      setPendingProducts(productsRes.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const handleVerifyProduct = async (productId, status) => {
    try {
      await api.put(`/admin/products/${productId}/verify`, { status });
      fetchAdminData();
    } catch (error) {
      console.error('Error verifying product:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard 👨‍💼</h1>
            <p>Platform overview and management</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E3F2FD' }}>
              <FaUsers style={{ color: '#2196F3' }} />
            </div>
            <div className="stat-content">
              <h3>{analytics?.users?.total || 0}</h3>
              <p>Total Users</p>
              <small>
                F: {analytics?.users?.farmers || 0} | 
                P: {analytics?.users?.processors || 0} | 
                C: {analytics?.users?.customers || 0}
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E8F5E9' }}>
              <FaBoxOpen style={{ color: '#4CAF50' }} />
            </div>
            <div className="stat-content">
              <h3>{analytics?.products?.total || 0}</h3>
              <p>Total Products</p>
              <small>Verified: {analytics?.products?.verified || 0}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FFF3E0' }}>
              <FaShoppingBag style={{ color: '#FF9800' }} />
            </div>
            <div className="stat-content">
              <h3>{analytics?.orders?.total || 0}</h3>
              <p>Total Orders</p>
              <small>Delivered: {analytics?.orders?.delivered || 0}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FCE4EC' }}>
              <FaRupeeSign style={{ color: '#E91E63' }} />
            </div>
            <div className="stat-content">
              <h3>{formatPrice(analytics?.revenue?.total || 0)}</h3>
              <p>Platform Revenue</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>
                <FaClock /> Pending Product Verifications
              </h2>
              <span className="badge badge-warning">{pendingProducts.length} pending</span>
            </div>
            <div className="verification-list">
              {pendingProducts.length === 0 ? (
                <div className="empty-state">
                  <FaCheckCircle size={48} color="#4CAF50" />
                  <p>All products verified! ✓</p>
                </div>
              ) : (
                pendingProducts.map(product => (
                  <div key={product._id} className="verification-card">
                    <div className="product-info">
                      <img 
                        src={product.images[0]?.url || '/placeholder.png'} 
                        alt={product.name}
                        className="product-thumbnail"
                      />
                      <div>
                        <h4>{product.name}</h4>
                        <p>Seller: {product.seller?.name}</p>
                        <p>Type: {product.milletType}</p>
                        <p>Price: {formatPrice(product.price)}/{product.unit}</p>
                      </div>
                    </div>
                    <div className="verification-actions">
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => handleVerifyProduct(product._id, 'approved')}
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button 
                        className="btn btn-outline btn-small"
                        onClick={() => handleVerifyProduct(product._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Popular Products</h2>
            </div>
            <div className="popular-products">
              {analytics?.popularProducts?.map(product => (
                <div key={product._id} className="product-item">
                  <span>{product.name}</span>
                  <span className="badge badge-info">{product.soldCount} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;