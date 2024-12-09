const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                itemId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Item',
                    required: true,
                },
                count: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
