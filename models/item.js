const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    itemType: {
        type: String,
        enum: ['spicy', 'sweet', 'sweet and spicy'],
        required: true
    },
    spicyLevel: {
        type: String,
        enum: ['less', 'regular', 'extra spicy'],
        default: 'regular'
    },
    sweetLevel: {
        type: String,
        enum: ['less', 'regular', 'extra sweet'],
        default: 'regular'
    },
    vegNonVeg: {
        type: String,
        enum: ['veg', 'non-veg'],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    customization: [
        {
            title: { type: String, required: true },
            selection: {
                type: String,
                enum: ["Single", "Multiple"],
                default: "Multiple",
            },
            list: [
                {
                    name: { type: String, required: true },
                    detail: { type: String },
                    extraRate: { type: Number },
                },
            ],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

module.exports = Item;