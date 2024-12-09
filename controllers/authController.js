const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const sendOtpEmail = require('../config/email');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, phone, country, state, city, restaurant, password, address, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const avatar = req.file ? req.file.path : null;

        user = new User({ firstname, lastname, email, phone, country, state, city, restaurant, password: await bcrypt.hash(password, 10), address, role, avatar });

        await user.save();

        const avatarUrl = avatar ? `${req.protocol}://${req.get('host')}/${avatar}` : null;

        res.status(201).json({
            msg: 'User registered successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('restaurant');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    const { firstname, lastname, email, phone, country, state, city, restaurant, address, role } = req.body;
    const userId = req.params.id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const avatar = req.file ? req.file.path : user.avatar;

        user = await User.findByIdAndUpdate(
            userId,
            { firstname, lastname, email, phone, country, state, city, restaurant, address, role, avatar },
            { new: true }
        );

        const avatarUrl = avatar ? `${req.protocol}://${req.get('host')}/${avatar}` : null;

        res.status(200).json({
            msg: 'User updated successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const otp = generateOtp();
        const otpDoc = new Otp({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60000),
        });

        await otpDoc.save();
        await sendOtpEmail(email, otp);

        res.status(200).json({ msg: 'OTP sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const verifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword, confirmPassword } = req.body;

    try {

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: 'Passwords do not match' });
        }

        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ msg: 'Invalid OTP' });

        if (otpRecord.expiresAt < Date.now()) {
            await Otp.deleteOne({ email, otp });
            return res.status(400).json({ msg: 'OTP expired' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        await Otp.deleteOne({ email, otp });
        res.status(200).json({ msg: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: 'New password and confirm password do not match' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};


module.exports = { register, login, getUsers, updateUser, forgotPassword, verifyOtpAndResetPassword, changePassword };