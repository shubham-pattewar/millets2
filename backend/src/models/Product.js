const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  milletType: {
    type: String,
    required: [true, 'Please specify millet type'],
    enum: [
      'Foxtail Millet',
      'Pearl Millet',
      'Finger Millet',
      'Little Millet',
      'Kodo Millet',
      'Proso Millet',
      'Barnyard Millet',
      'Sorghum',
      'Other'
    ]
  },
  category: {
    type: String,
    enum: ['Raw Grain', 'Flour', 'Ready-to-Cook', 'Snacks', 'Processed', 'Other'],
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    enum: ['kg', 'gram', 'quintal', 'ton', 'piece', 'packet'],
    default: 'kg'
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide available quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerType: {
    type: String,
    enum: ['farmer', 'processor'],
    required: true
  },
  certifications: [{
    name: String,
    documentUrl: String,
    issueDate: Date,
    expiryDate: Date,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  rejectionReason: String,
  location: {
    state: String,
    district: String,
    pincode: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  nutritionalInfo: {
    protein: Number,
    fiber: Number,
    iron: Number,
    calcium: Number,
    calories: Number
  },
  benefits: [String],
  storage: String,
  shelfLife: String,
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  soldCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', milletType: 'text' });
productSchema.index({ seller: 1, isActive: 1 });
productSchema.index({ rating: -1, numReviews: -1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

productSchema.virtual('averageRating').get(function() {
  if (this.numReviews === 0) return 0;
  return (this.rating / this.numReviews).toFixed(1);
});

module.exports = mongoose.model('Product', productSchema);