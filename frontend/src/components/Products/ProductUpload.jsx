import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './Products.css';

const ProductUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    milletType: '',
    category: '',
    price: '',
    unit: 'kg',
    quantity: '',
    minOrderQuantity: '1',
    location: {
      state: '',
      district: '',
      pincode: ''
    },
    nutritionalInfo: {
      protein: '',
      fiber: '',
      iron: '',
      calcium: '',
      calories: ''
    },
    storage: '',
    shelfLife: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const milletTypes = [
    'Foxtail Millet',
    'Pearl Millet',
    'Finger Millet',
    'Little Millet',
    'Kodo Millet',
    'Proso Millet',
    'Barnyard Millet',
    'Sorghum',
    'Other'
  ];

  const categories = [
    'Raw Grain',
    'Flour',
    'Ready-to-Cook',
    'Snacks',
    'Processed',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && formData[key] !== null) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      images.forEach(image => {
        submitData.append('images', image);
      });

      const response = await api.post('/products', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Product uploaded successfully! Awaiting admin verification.');
        navigate(`/${user.role}/dashboard`);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error uploading product:', error);
      toast.error(error.response?.data?.message || 'Failed to upload product');
      setLoading(false);
    }
  };

  return (
    <div className="product-upload-container">
      <div className="container">
        <div className="upload-header">
          <h1>Upload New Product</h1>
          <p>Add your millet products to the marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Organic Pearl Millet"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your product in detail..."
                className="form-textarea"
                rows="5"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="milletType">Millet Type *</label>
                <select
                  id="milletType"
                  name="milletType"
                  value={formData.milletType}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Millet Type</option>
                  {milletTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing & Quantity</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit *</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="gram">Gram (g)</option>
                  <option value="quintal">Quintal</option>
                  <option value="ton">Ton</option>
                  <option value="piece">Piece</option>
                  <option value="packet">Packet</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Available Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="minOrderQuantity">Minimum Order Quantity</label>
                <input
                  type="number"
                  id="minOrderQuantity"
                  name="minOrderQuantity"
                  value={formData.minOrderQuantity}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Product Images *</h3>
            <p className="form-hint">Upload up to 5 images (JPG, PNG). First image will be the main image.</p>
            
            <div className="image-upload-section">
              <label htmlFor="images" className="image-upload-label">
                <FaUpload />
                <span>Click to upload images</span>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        <FaTimes />
                      </button>
                      {index === 0 && <span className="main-badge">Main</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Location</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location.state">State</label>
                <input
                  type="text"
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="e.g., Karnataka"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location.district">District</label>
                <input
                  type="text"
                  id="location.district"
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleChange}
                  placeholder="e.g., Bangalore"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location.pincode">Pincode</label>
                <input
                  type="text"
                  id="location.pincode"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleChange}
                  placeholder="e.g., 560001"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Nutritional Information (Optional)</h3>
            <p className="form-hint">Values per 100g</p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nutritionalInfo.protein">Protein (g)</label>
                <input
                  type="number"
                  id="nutritionalInfo.protein"
                  name="nutritionalInfo.protein"
                  value={formData.nutritionalInfo.protein}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="0.0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nutritionalInfo.fiber">Fiber (g)</label>
                <input
                  type="number"
                  id="nutritionalInfo.fiber"
                  name="nutritionalInfo.fiber"
                  value={formData.nutritionalInfo.fiber}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="0.0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nutritionalInfo.iron">Iron (mg)</label>
                <input
                  type="number"
                  id="nutritionalInfo.iron"
                  name="nutritionalInfo.iron"
                  value={formData.nutritionalInfo.iron}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="0.0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nutritionalInfo.calcium">Calcium (mg)</label>
                <input
                  type="number"
                  id="nutritionalInfo.calcium"
                  name="nutritionalInfo.calcium"
                  value={formData.nutritionalInfo.calcium}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="0.0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nutritionalInfo.calories">Calories (kcal)</label>
                <input
                  type="number"
                  id="nutritionalInfo.calories"
                  name="nutritionalInfo.calories"
                  value={formData.nutritionalInfo.calories}
                  onChange={handleChange}
                  placeholder="0"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="storage">Storage Instructions</label>
                <input
                  type="text"
                  id="storage"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  placeholder="e.g., Store in a cool, dry place"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="shelfLife">Shelf Life</label>
                <input
                  type="text"
                  id="shelfLife"
                  name="shelfLife"
                  value={formData.shelfLife}
                  onChange={handleChange}
                  placeholder="e.g., 6 months"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpload;