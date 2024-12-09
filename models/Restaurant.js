const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    restaurant_name: { type: String, required: true },
    restaurant_address: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);