import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './Cart.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="container">
          <div className="empty-cart">
            <FaHeart size={80} color="#CCC" />
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite products here!</p>
            <Link to="/marketplace" className="btn btn-primary">
              Browse Products
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
          <h1>My Wishlist</h1>
          <p>{wishlistItems.length} items saved</p>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item._id} className="wishlist-card">
              <Link to={`/product/${item._id}`}>
                <img 
                  src={getImageUrl(item.images[0]?.url)} 
                  alt={item.name}
                  className="wishlist-image"
                />
              </Link>

              <div className="wishlist-details">
                <Link to={`/product/${item._id}`} className="wishlist-name">
                  {item.name}
                </Link>
                <p className="wishlist-type">{item.milletType}</p>
                <p className="wishlist-price">
                  {formatPrice(item.price)} / {item.unit}
                </p>

                <div className="wishlist-actions">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn btn-primary btn-small"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="btn btn-outline btn-small"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;