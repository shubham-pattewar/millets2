import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaRupeeSign, FaShoppingBag, FaClock, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import './Dashboard.css';

const ProcessorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, salesRes, purchasesRes] = await Promise.all([
        api.get('/products/seller/my-products'),
        api.get('/orders/seller-orders'),
        api.get('/orders/my-orders')
      ]);

      const myProducts = productsRes.data.products;
      const mySales = salesRes.data.orders;
      const myPurchases = purchasesRes.data.orders;

      const deliveredSales = mySales.filter(o => o.orderStatus === 'delivered');
      const totalEarnings = deliveredSales.reduce((sum, o) => sum + o.totalPrice, 0);

      setStats({
        totalProducts: myProducts.length,
        totalSales: mySales.length,
        totalPurchases: myPurchases.length,
        totalEarnings: totalEarnings
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
            <h1>Welcome, {user?.name}! 🏭</h1>
            <p>Manage your processing business from here</p>
          </div>
          <Link to="/upload-product" className="btn btn-primary">
            <FaPlus /> Add Processed Product
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E3F2FD' }}>
              <FaBoxOpen style={{ color: '#2196F3' }} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Products Listed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E8F5E9' }}>
              <FaShoppingBag style={{ color: '#4CAF50' }} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalSales}</h3>
              <p>Total Sales</p>
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
              <h3>{stats.totalPurchases}</h3>
              <p>Raw Material Orders</p>
            </div>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h3>🌾 Buy Raw Millets</h3>
            <p>Browse and purchase raw millets directly from farmers</p>
            <Link to="/marketplace?category=Raw+Grain" className="btn btn-primary">
              Browse Raw Millets
            </Link>
          </div>

          <div className="info-card">
            <h3>📦 Sell Processed Products</h3>
            <p>List your processed millet products for customers</p>
            <Link to="/upload-product" className="btn btn-secondary">
              Add Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessorDashboard;