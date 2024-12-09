const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

router.post('/', authenticate, cartController.addToCart);
router.get('/', authenticate, cartController.getCart);
router.delete('/:cartId/item/:itemId', authenticate, cartController.removeFromCart);
router.put('/:cartId/item/:itemId/increment', authenticate, cartController.incrementCount);
router.put('/:cartId/item/:itemId/decrement', authenticate, cartController.decrementCount);
router.get('/total', authenticate, cartController.calculateCartTotal);

module.exports = router;
