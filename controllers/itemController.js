const Item = require('../models/item');
const Category = require('../models/category');
const path = require('path');

const createItem = async (req, res) => {
    try {

        const { name, ingredients, price, discount, category, itemType, spicyLevel, sweetLevel, vegNonVeg } = req.body;

        let customization = req.body.customization;
        if (typeof customization === 'string') {
            customization = JSON.parse(customization);
        }

        const image = req.file.path ? req.file.path : null;

        if (!name || !ingredients || !price || !category || !itemType || !vegNonVeg || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const item = new Item({ name, ingredients, price, discount, category, itemType, spicyLevel, sweetLevel, vegNonVeg, image, customization });

        await item.save();
        res.status(201).json(item);
    } catch (error) {
        console.error("Error in createItem:", error);
        res.status(500).json({ message: 'Error creating item', error: error.message });
    }
};

const getItems = async (req, res) => {
    try {
        const items = await Item.find().populate('category');
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { name, ingredients, price, discount, category, itemType, spicyLevel, sweetLevel, vegNonVeg, customization } = req.body;
        const image = req.file ? req.file.path : null;

        const updatedData = { name, ingredients, price, discount, category, itemType, spicyLevel, sweetLevel, vegNonVeg, customization };
        if (image) updatedData.image = image;

        const item = await Item.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getItemCustomization = async (req, res) => {
    try {
        const itemId = req.params.id;

        const item = await Item.findById(itemId, 'customization');

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ customization: item.customization });
    } catch (error) {
        console.error("Error fetching customization data:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createItem, getItems, updateItem, deleteItem, getItemCustomization };