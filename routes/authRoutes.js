const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, logout } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

router.post('/register', upload.single('avatar'), authController.register);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.put('/users/:id', upload.single('avatar'), authController.updateUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.verifyOtpAndResetPassword);
router.put('/change-password', authenticate, authController.changePassword);
router.post('/logout', authenticate, logout);

module.exports = router;
