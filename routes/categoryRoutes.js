const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/food/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/', authenticate, upload.single('image'), categoryController.createCategory);
router.get('/', authenticate, categoryController.getCategories);
router.get('/:id', authenticate, categoryController.getCategoryById);
router.put('/:id', authenticate, upload.single('image'), categoryController.updateCategory);
router.delete('/:id', authenticate, categoryController.deleteCategory);

module.exports = router;
