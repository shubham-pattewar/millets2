import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import api from '../../utils/api';
import ProductCard from '../Products/ProductCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import './Marketplace.css';

const MarketplaceHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    milletType: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: 'createdAt'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const milletTypes = [
    'Foxtail Millet',
    'Pearl Millet',
    'Finger Millet',
    'Little Millet',
    'Kodo Millet',
    'Proso Millet',
    'Barnyard Millet',
    'Sorghum'
  ];

  const categories = [
    'Raw Grain',
    'Flour',
    'Ready-to-Cook',
    'Snacks',
    'Processed'
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { ...filters, page, verified: true };
      
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await api.get('/products', { params });
      setProducts(response.data.products);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="marketplace-container">
      <div className="container">
        <div className="marketplace-header">
          <h1>🌾 Millets Marketplace</h1>
          <p>Discover high-quality millets from verified sellers</p>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for millets, products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        <div className="marketplace-content">
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>
                <FaFilter /> Filters
              </h3>

              <div className="filter-group">
                <label>Millet Type</label>
                <select
                  value={filters.milletType}
                  onChange={(e) => handleFilterChange('milletType', e.target.value)}
                  className="form-select"
                >
                  <option value="">All Types</option>
                  {milletTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="form-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Price Range (₹)</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="form-input"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="form-select"
                >
                  <option value="">All Ratings</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                  <option value="2">2★ & above</option>
                </select>
              </div>

              <button 
                className="btn btn-outline"
                onClick={() => {
                  setFilters({
                    search: '',
                    milletType: '',
                    category: '',
                    minPrice: '',
                    maxPrice: '',
                    rating: '',
                    sort: 'createdAt'
                  });
                  setPage(1);
                }}
              >
                Clear Filters
              </button>
            </div>
          </aside>

          <main className="products-section">
            <div className="products-header">
              <p className="results-count">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
              <div className="sort-section">
                <FaSort />
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="form-select"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner message="Loading products..." />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-outline"
                      disabled={page === 1}
                      onClick={() => setPage(prev => prev - 1)}
                    >
                      Previous
                    </button>
                    <span className="page-info">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      className="btn btn-outline"
                      disabled={page === totalPages}
                      onClick={() => setPage(prev => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHome;