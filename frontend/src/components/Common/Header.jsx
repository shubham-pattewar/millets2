import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaGlobe,
  FaSignOutAlt
} from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();
  const { language, changeLanguage, availableLanguages, t } = useLanguage();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    const routes = {
      farmer: '/farmer/dashboard',
      processor: '/processor/dashboard',
      customer: '/customer/dashboard',
      admin: '/admin/dashboard'
    };
    return routes[user.role] || '/marketplace';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/marketplace" className="logo">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">Millets Hub</span>
          </Link>

          <nav className="nav-desktop">
            <Link to="/marketplace" className="nav-link">{t('marketplace')}</Link>
            <Link to="/benefits" className="nav-link">{t('benefits')}</Link>
            <Link to="/recipes" className="nav-link">{t('recipes')}</Link>
            <Link to="/quiz" className="nav-link">{t('quiz')}</Link>
          </nav>

          <div className="header-actions">
            <div className="language-selector">
              <button 
                className="icon-btn"
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              >
                <FaGlobe />
              </button>
              {languageMenuOpen && (
                <div className="language-dropdown">
                  {availableLanguages.map(lang => (
                    <button
                      key={lang.code}
                      className={`language-option ${language === lang.code ? 'active' : ''}`}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setLanguageMenuOpen(false);
                      }}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {(user?.role === 'customer' || user?.role === 'processor') && (
                  <>
                    <Link to="/wishlist" className="icon-btn" title="Wishlist">
                      <FaHeart />
                    </Link>
                    <Link to="/cart" className="icon-btn cart-icon" title="Cart">
                      <FaShoppingCart />
                      {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                  </>
                )}
                
                <Link to={getDashboardRoute()} className="icon-btn" title="Dashboard">
                  <FaUser />
                </Link>
                
                <button onClick={handleLogout} className="icon-btn" title="Logout">
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-small">
                  {t('login')}
                </Link>
                <Link to="/signup" className="btn btn-primary btn-small">
                  {t('signup')}
                </Link>
              </>
            )}

            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="nav-mobile">
            <Link 
              to="/marketplace" 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('marketplace')}
            </Link>
            <Link 
              to="/benefits" 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('benefits')}
            </Link>
            <Link 
              to="/recipes" 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('recipes')}
            </Link>
            <Link 
              to="/quiz" 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('quiz')}
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to={getDashboardRoute()} 
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('dashboard')}
                </Link>
                {(user?.role === 'customer' || user?.role === 'processor') && (
                  <>
                    <Link 
                      to="/wishlist" 
                      className="nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('wishlist')}
                    </Link>
                    <Link 
                      to="/cart" 
                      className="nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('cart')} {cartCount > 0 && `(${cartCount})`}
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;