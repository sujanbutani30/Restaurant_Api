require('dotenv').config();
const Cart = require('../models/cart');
const User = require('../models/User');
const Order = require('../models/Order');
const { calculateCartTotal } = require('../controllers/cartController');

// Create Card Payment
const createCardPayment = async (req, res) => {
  const userId = req.user._id;

  try {
    const cartTotalData = await calculateCartTotal(req, res);

    if (!cartTotalData) {
      return res.status(500).json({ message: 'Error calculating total amount' });
    }

    const { payableAmount } = cartTotalData;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = new Order({
      userId,
      totalAmount: payableAmount,
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      orderStatus: 'Confirmed',
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment successful!',
      payableAmount: payableAmount,
      orderId: order._id,
    });

  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Error processing card payment', error: error.message });
    }
  }
};

// Create Cash Payment
const createCashPayment = async (req, res) => {
  const userId = req.user._id;

  try {
    const cartTotalData = await calculateCartTotal(req, res);

    if (!cartTotalData) {
      return res.status(500).json({ message: 'Error calculating total amount' });
    }

    const { payableAmount } = cartTotalData;

    const order = new Order({
      userId,
      totalAmount: payableAmount,
      paymentStatus: 'Pending',
      paymentMethod: 'Cash',
      orderStatus: 'Confirmed',
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Cash payment initiated successfully.',
      payableAmount: payableAmount,
    });

  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Error while processing cash payment', error: error.message });
    }
  }
};

module.exports = { createCashPayment, createCardPayment };