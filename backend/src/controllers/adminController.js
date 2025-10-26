const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ verificationStatus: 'pending' })
      .populate('seller', 'name email phone businessDetails farmDetails')
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

exports.verifyProduct = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.verificationStatus = status;
    product.verifiedBy = req.user.id;
    product.verifiedAt = Date.now();

    if (status === 'approved') {
      product.isVerified = true;
    } else if (status === 'rejected') {
      product.isVerified = false;
      product.rejectionReason = rejectionReason;
    }

    await product.save();

    const io = req.app.get('io');
    io.to(product.seller.toString()).emit('notification', {
      type: 'product',
      message: `Your product "${product.name}" has been ${status}`,
      productId: product._id
    });

    res.status(200).json({
      success: true,
      message: `Product ${status} successfully`,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive, isVerified } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalProcessors = await User.countDocuments({ role: 'processor' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const totalProducts = await Product.countDocuments({ isActive: true });
    const verifiedProducts = await Product.countDocuments({ isVerified: true });
    const pendingProducts = await Product.countDocuments({ verificationStatus: 'pending' });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

    const orders = await Order.find({ orderStatus: 'delivered' });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    const popularProducts = await Product.find({ isActive: true })
      .sort({ soldCount: -1 })
      .limit(10)
      .populate('seller', 'name');

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('buyer', 'name')
      .populate('seller', 'name');

    res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          farmers: totalFarmers,
          processors: totalProcessors,
          customers: totalCustomers
        },
        products: {
          total: totalProducts,
          verified: verifiedProducts,
          pending: pendingProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          delivered: deliveredOrders
        },
        revenue: {
          total: totalRevenue
        },
        popularProducts,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};