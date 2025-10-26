import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaStar, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './Products.css';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product);
  };

  const canPurchase = user && (user.role === 'customer' || user.role === 'processor');

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image-wrapper">
        <img 
          src={getImageUrl(product.images[0]?.url)} 
          alt={product.name}
          className="product-image"
        />
        {product.isVerified && (
          <span className="verified-badge">
            <FaCheckCircle /> Verified
          </span>
        )}
        {canPurchase && (
          <button
            className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
            onClick={handleAddToWishlist}
          >
            <FaHeart />
          </button>
        )}
      </div>

      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-type">{product.milletType}</p>
        
        <div className="product-rating">
          <FaStar color="#FFD700" />
          <span>{product.rating > 0 ? (product.rating / product.numReviews).toFixed(1) : '0.0'}</span>
          <span className="reviews-count">({product.numReviews} reviews)</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="price">{formatPrice(product.price)}</span>
            <span className="unit">/{product.unit}</span>
          </div>

          {canPurchase && (
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              <FaShoppingCart /> Add
            </button>
          )}
        </div>

        {product.quantity < 10 && product.quantity > 0 && (
          <p className="low-stock">Only {product.quantity} {product.unit} left!</p>
        )}

        {product.quantity === 0 && (
          <p className="out-of-stock">Out of Stock</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;