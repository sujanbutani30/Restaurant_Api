const Order = require('../models/Order');

const createOrder = async (req, res) => {
    const { cartId, userId, cookingRequest, count, type, Status } = req.body;

    try {
        const order = new Order({
            cartId,
            userId,
            cookingRequest,
            count: count || 1,
            type,
            Status,
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('cartId').populate('userId');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('cartId').populate('userId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createOrder, getAllOrders, getOrderById, deleteOrder };
