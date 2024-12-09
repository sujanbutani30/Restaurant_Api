const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        require: true,
    },
    qrname: {
        type: String,
    },
    tableNumber: {
        type: Number,
    },
    counterNumber: {
        type: Number,
    },
    link: {
        type: String,
        require: true,
    },
    additionalText: {
        type: String,
        default: "",
    },
    color: {
        type: String,
    },
    frameBackground: {
        type: String,
    },
    qrBackground: {
        type: String,
    },
    category: {
        type: String,
    },
    qrType: {
        type: String,
        enum: ["SVG", "PNG"],
        require: true,
    }
},
    {
        timestamps: true,
    }
);

const QRCode = mongoose.model("QRCode", qrCodeSchema);

module.exports = QRCode;