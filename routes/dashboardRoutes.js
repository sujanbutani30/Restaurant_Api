const express = require('express');
const router = express.Router();
const { getTotalOrderToday, getOrderTypeCounts, getTodayRevenue, getMonthWiseOrders, getPopularDishes } = require('../controllers/dashboardController'); // Adjust path as needed
const { authenticate } = require('../middleware/authMiddleware');

router.get('/totalOrderToday', authenticate, getTotalOrderToday);
router.get('/orderTypeCounts', authenticate, getOrderTypeCounts);
router.get('/today-revenue', authenticate, getTodayRevenue);
router.get('/monthwiseorders', authenticate, getMonthWiseOrders);
router.get('/getPopular-Dishes', authenticate, getPopularDishes);

module.exports = router;
