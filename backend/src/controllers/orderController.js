const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    const seller = orderItems[0].seller;

    const order = await Order.create({
      buyer: req.user.id,
      seller,
      orderItems,
      shippingAddress,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity -= item.quantity;
        product.soldCount += item.quantity;
        await product.save();
      }
    }

    const sellerUser = await User.findById(seller);
    if (sellerUser) {
      sellerUser.totalOrders += 1;
      await sellerUser.save();
    }

    const io = req.app.get('io');
    io.to(seller.toString()).emit('notification', {
      type: 'order',
      message: 'New order received',
      orderId: order._id
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('seller', 'name email phone')
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate('buyer', 'name email phone address')
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone address')
      .populate('seller', 'name email phone address')
      .populate('orderItems.product', 'name images milletType');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (
      order.buyer.toString() !== req.user.id &&
      order.seller.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.orderStatus = status;
    order.statusHistory.push({ status, note });

    if (status === 'delivered') {
      order.deliveredAt = Date.now();
      const seller = await User.findById(order.seller);
      if (seller) {
        seller.totalEarnings += order.totalPrice;
        await seller.save();
      }
    }

    if (status === 'cancelled') {
      order.cancelledAt = Date.now();
      order.cancellationReason = note;
    }

    await order.save();

    const io = req.app.get('io');
    io.to(order.buyer.toString()).emit('notification', {
      type: 'order',
      message: `Order ${order.orderNumber} status updated to ${status}`,
      orderId: order._id
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentInfo.transactionId = transactionId;
    order.paymentInfo.status = status;

    if (status === 'completed') {
      order.paymentInfo.paidAt = Date.now();
      order.orderStatus = 'confirmed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};