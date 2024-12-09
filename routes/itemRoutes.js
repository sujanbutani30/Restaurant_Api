const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticate } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/items/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', authenticate, upload.single('image'), itemController.createItem);
router.get('/', authenticate, itemController.getItems);
router.put('/:id', authenticate, upload.single('image'), itemController.updateItem);
router.delete('/:id', authenticate, itemController.deleteItem);
router.get('/:id/customization', itemController.getItemCustomization);

module.exports = router;