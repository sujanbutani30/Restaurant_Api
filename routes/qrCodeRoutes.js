const express = require("express");
const { createQRCode, getAllQRCodes, getQRCodesByTable, updateQRCode, deleteQRCode } = require("../controllers/qrCodeController");
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", authenticate, createQRCode);
router.get("/", authenticate, getAllQRCodes);
router.get("/:tableNumber", authenticate, getQRCodesByTable);
router.put("/:id", authenticate, updateQRCode);
router.delete("/:id", authenticate, deleteQRCode);

module.exports = router;