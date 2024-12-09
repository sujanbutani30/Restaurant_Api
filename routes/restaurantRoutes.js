const express = require('express');
const router = express.Router();
const { createRestaurant, getAllRestaurants } = require('../controllers/restaurantController');

router.post('/create', createRestaurant);
router.get('/restaurants', getAllRestaurants);

module.exports = router;
