const express = require('express');
const router = express.Router();
const { createCashPayment, createCardPayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/pay/cash', authenticate, createCashPayment);
router.post('/pay/card', authenticate, createCardPayment);

module.exports = router;