const jwt = require('jsonwebtoken');
const User = require('../models/User');

let blacklistedTokens = [];

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided, authorization denied' });
  }

  try {
    if (blacklistedTokens.includes(token)) {
      return res.status(401).json({ msg: 'Token has been logged out' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: 'Unauthorized: Token is not valid' });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: 'Unauthorized: Token is not valid' });
  }
};

const logout = async (req, res) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      return res.status(400).json({
        ErrorCode: "INVALID_TOKEN",
        ErrorMessage: "Token not provided",
      });
    }

    const token = bearerHeader.startsWith("Bearer ")
      ? bearerHeader.split(" ")[1]
      : bearerHeader;

    blacklistedTokens.push(token);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authenticate, verifyAdmin, logout };
