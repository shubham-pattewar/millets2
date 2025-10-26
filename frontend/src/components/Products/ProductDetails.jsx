import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaCheckCircle, FaMapMarkerAlt, FaBox } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import { toast } from 'react-toastify';
import './Products.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    addToWishlist(product);
  };

  if (loading) {
    return <LoadingSpinner message="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/marketplace')} className="btn btn-primary">
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const canPurchase = user && (user.role === 'customer' || user.role === 'processor');

  return (
    <div className="product-details-container">
      <div className="container">
        <div className="product-details-grid">
          <div className="product-images-section">
            <div className="main-image">
              <img 
                src={getImageUrl(product.images[selectedImage]?.url)} 
                alt={product.name}
              />
              {product.isVerified && (
                <span className="verified-badge-large">
                  <FaCheckCircle /> Verified Product
                </span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img.url)}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            
            <div className="product-meta">
              <div className="rating-section">
                <FaStar color="#FFD700" size={20} />
                <span className="rating-value">
                  {product.numReviews > 0 
                    ? (product.rating / product.numReviews).toFixed(1) 
                    : '0.0'}
                </span>
                <span className="reviews-count">({product.numReviews} reviews)</span>
              </div>
              
              <div className="product-tags">
                <span className="tag">{product.milletType}</span>
                <span className="tag">{product.category}</span>
              </div>
            </div>

            <div className="price-section">
              <span className="current-price">{formatPrice(product.price)}</span>
              <span className="price-unit">per {product.unit}</span>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.benefits && product.benefits.length > 0 && (
              <div className="benefits-section">
                <h3>Health Benefits</h3>
                <ul>
                  {product.benefits.map((benefit, index) => (
                    <li key={index}><FaCheckCircle color="#4CAF50" /> {benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="product-availability">
              {product.quantity > 0 ? (
                <p className="in-stock">
                  <FaBox color="#4CAF50" /> In Stock: {product.quantity} {product.unit} available
                </p>
              ) : (
                <p className="out-of-stock">Out of Stock</p>
              )}
            </div>

            {canPurchase && product.quantity > 0 && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Quantity ({product.unit})</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.quantity}
                      className="quantity-input"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-outline btn-large"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="btn btn-primary btn-large"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className={`btn btn-icon ${isInWishlist(product._id) ? 'active' : ''}`}
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>
            )}

            <div className="seller-info">
              <h3>Seller Information</h3>
              <div className="seller-details">
                <p><strong>Name:</strong> {product.seller?.name}</p>
                <p><strong>Type:</strong> {product.sellerType}</p>
                {product.location?.state && (
                  <p>
                    <FaMapMarkerAlt /> {product.location.state}
                    {product.location.district && `, ${product.location.district}`}
                  </p>
                )}
              </div>
            </div>

            {product.nutritionalInfo && (
              <div className="nutritional-info">
                <h3>Nutritional Information (per 100g)</h3>
                <div className="nutrition-grid">
                  {product.nutritionalInfo.protein && (
                    <div className="nutrition-item">
                      <span className="label">Protein</span>
                      <span className="value">{product.nutritionalInfo.protein}g</span>
                    </div>
                  )}
                  {product.nutritionalInfo.fiber && (
                    <div className="nutrition-item">
                      <span className="label">Fiber</span>
                      <span className="value">{product.nutritionalInfo.fiber}g</span>
                    </div>
                  )}
                  {product.nutritionalInfo.iron && (
                    <div className="nutrition-item">
                      <span className="label">Iron</span>
                      <span className="value">{product.nutritionalInfo.iron}mg</span>
                    </div>
                  )}
                  {product.nutritionalInfo.calcium && (
                    <div className="nutrition-item">
                      <span className="label">Calcium</span>
                      <span className="value">{product.nutritionalInfo.calcium}mg</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <div className="reviews-section">
            <h2>Customer Reviews</h2>
            <div className="reviews-list">
              {product.reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div>
                      <strong>{review.name}</strong>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < review.rating ? '#FFD700' : '#DDD'}
                            size={16}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
