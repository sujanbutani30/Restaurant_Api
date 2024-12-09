const QRCode = require("../models/QRCode");
const qr = require("qrcode");

const createQRCode = async (req, res) => {
    try {
        const { restaurant, qrname, tableNumber, counterNumber, link, additionalText, color, frameBackground, qrBackground, category, qrType } = req.body;

        const qrData = new QRCode({ restaurant, qrname, tableNumber, counterNumber, link, additionalText, color, frameBackground, qrBackground, category, qrType });
        await qrData.save();

        const qrOptions = {
            color: {
                dark: color || "#000000",
                light: qrBackground || "#FFFFFF",
            },
        };
        let qrImage;
        if (qrType === "SVG") {
            qrImage = await qr.toString(link, { type: "svg", ...qrOptions });
        } else if (qrType === "PNG") {
            qrImage = await qr.toDataURL(link, qrOptions);
        } else {
            throw new Error("Invalid QR type");
        }

        res.status(201).json({
            success: true,
            message: "QR Code created successfully",
            data: qrData,
            qrImage,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllQRCodes = async (req, res) => {
    try {
        const qrCodes = await QRCode.find();
        res.status(200).json({ success: true, data: qrCodes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getQRCodesByTable = async (req, res) => {
    try {
        const { tableNumber } = req.params;
        const qrCode = await QRCode.findOne({ tableNumber }).populate("restaurant");
        if (!qrCode) {
            return res.status(404).json({ success: false, message: "QR Code not found" });
        }
        res.status(200).json({ success: true, data: qrCode });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateQRCode = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedQRCode = await QRCode.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedQRCode) {
            return res.status(404).json({ success: false, message: "QR Code not found" });
        }
        res.status(200).json({ success: true, message: "QR Code updated successfully", data: updatedQRCode });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteQRCode = async (req, res) => {
    try {
        const { id } = req.params;
        await QRCode.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "QR Code deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createQRCode, getAllQRCodes, getQRCodesByTable, updateQRCode, deleteQRCode };