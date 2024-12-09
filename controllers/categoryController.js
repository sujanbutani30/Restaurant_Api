const Category = require('../models/category');
const path = require('path');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file ? req.file.path : null;
        const createdBy = req.user.id;

        if (!name || !image) return res.status(400).json({ message: 'Name and image are required' });

        const category = new Category({ name, image, createdBy });
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('createdBy');

        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.find(req.params.id).populate('createdBy', 'firstname lastname email');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file ? req.file.path : null;
        const updatedData = { name };

        if (image) {
            updatedData.image = image;
        }

        if (!name && !image) {
            return res.status(400).json({ message: 'Name or image required for update' });
        }

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (!image) {
            updatedData.image = category.image;
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };