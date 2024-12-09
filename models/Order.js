const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cookingRequest: { type: String },
    type: {
        type: String,
        enum: ["Parcel", "Onsite"],
        required: true
    },
    Status: {
        type: String,
        enum: ["Delivered", "InProgress", "Accept"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
