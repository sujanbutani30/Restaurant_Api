const Restaurant = require('../models/Restaurant');

const createRestaurant = async (req, res) => {
    const { restaurant_name, restaurant_address, country, city, state, zip_code } = req.body;

    try {
        const newRestaurant = new Restaurant({
            restaurant_name, restaurant_address, country, city, state, zip_code,
        });
        await newRestaurant.save();

        res.status(201).json({ msg: 'Restaurant created successfully', restaurant: newRestaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { createRestaurant, getAllRestaurants };