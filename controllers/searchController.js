const Item = require('../models/item');

const searchItems = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({ message: 'Keyword is required for searching' });
        }

        const items = await Item.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { ingredients: { $regex: keyword, $options: 'i' } },
                { 'category.name': { $regex: keyword, $options: 'i' } }
            ]
        }).populate('category');

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { searchItems };