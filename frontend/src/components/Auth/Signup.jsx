import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserTag } from 'react-icons/fa';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      const roleRoutes = {
        farmer: '/farmer/dashboard',
        processor: '/processor/dashboard',
        customer: '/customer/dashboard'
      };
      navigate(roleRoutes[result.user.role] || '/marketplace');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🌾 {t('signup')}</h1>
          <p>Join the Millets Revolution</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> {t('email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FaPhone /> Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              placeholder="10-digit phone number"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <FaUserTag /> I am a
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="customer">Customer (Buyer)</option>
              <option value="farmer">Farmer (Seller)</option>
              <option value="processor">Processor (Seller)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> {t('password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Minimum 6 characters"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FaLock /> {t('confirmPassword')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Re-enter password"
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? 'Creating Account...' : t('signup')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="link-primary">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;