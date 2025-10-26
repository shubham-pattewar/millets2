import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="logo-icon">🌾</span> Millets Hub
            </h3>
            <p className="footer-description">
              Connecting farmers, processors, and customers in the millets value chain. 
              Building a healthier India with sustainable agriculture.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/marketplace">{t('marketplace')}</Link></li>
              <li><Link to="/benefits">{t('benefits')}</Link></li>
              <li><Link to="/recipes">{t('recipes')}</Link></li>
              <li><Link to="/quiz">{t('quiz')}</Link></li>
              <li><Link to="/about">{t('about')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">For Sellers</h4>
            <ul className="footer-links">
              <li><Link to="/signup">Become a Seller</Link></li>
              <li><Link to="/upload-product">Upload Products</Link></li>
              <li><Link to="/seller-guidelines">Seller Guidelines</Link></li>
              <li><Link to="/certifications">Certifications</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt />
                <span>Bangalore, Karnataka, India</span>
              </li>
              <li>
                <FaEnvelope />
                <a href="mailto:support@milletshub.com">support@milletshub.com</a>
              </li>
              <li>
                <FaPhone />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Millets Hub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;