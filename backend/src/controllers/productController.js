const Product = require('../models/Product');
const User = require('../models/User');

exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      milletType,
      category,
      minPrice,
      maxPrice,
      rating,
      location,
      sort,
      page = 1,
      limit = 12,
      verified
    } = req.query;

    const query = { isActive: true };

    if (verified === 'true' || !req.user || req.user.role === 'customer') {
      query.isVerified = true;
      query.verificationStatus = 'approved';
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (milletType) query.milletType = milletType;
    if (category) query.category = category;
    if (location) query['location.state'] = location;
    if (rating) query.rating = { $gte: parseFloat(rating) };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_low') sortOption = { price: 1 };
    if (sort === 'price_high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1, numReviews: -1 };
    if (sort === 'popular') sortOption = { soldCount: -1, viewCount: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .populate('seller', 'name rating location businessDetails farmDetails')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email phone rating location businessDetails farmDetails')
      .populate('reviews.user', 'name profileImage');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.viewCount += 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    req.body.seller = req.user.id;
    req.body.sellerType = req.user.role;

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => ({
        url: `/uploads/products/${file.filename}`,
        publicId: file.filename
      }));
    }

    const product = await Product.create(req.body);

    const io = req.app.get('io');
    const admins = await User.find({ role: 'admin' });
    admins.forEach(admin => {
      io.to(admin._id.toString()).emit('notification', {
        type: 'product',
        message: 'New product submitted for verification',
        productId: product._id
      });
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully. Awaiting admin verification.',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/products/${file.filename}`,
        publicId: file.filename
      }));
      req.body.images = [...(product.images || []), ...newImages];
    }

    if (product.isVerified && req.user.role !== 'admin') {
      req.body.verificationStatus = 'pending';
      req.body.isVerified = false;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed'
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      images: req.files ? req.files.map(f => `/uploads/reviews/${f.filename}`) : []
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0);

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};