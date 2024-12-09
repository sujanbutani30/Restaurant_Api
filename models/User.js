const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    password: { type: String, required: true },
    address: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'] },
});

module.exports = mongoose.model('User', userSchema);