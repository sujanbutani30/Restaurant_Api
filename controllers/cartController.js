const Cart = require('../models/cart');

const addToCart = async (req, res) => {
    const { items } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items });
        }
        else {
            items.forEach((newItem) => {
                const existingItem = cart.items.find(
                    (item) => item.itemId.toString() === newItem.itemId
                );
                if (existingItem) {
                    existingItem.count += newItem.count;
                } else {
                    cart.items.push(newItem);
                }
            });
        }

        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCart = async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.itemId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    const { cartId, itemId } = req.params;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const incrementCount = async (req, res) => {
    const { cartId, itemId } = req.params;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find((i) => i.itemId.toString() === itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.count += 1;
        await cart.save();

        res.status(200).json({ message: 'Item count incremented', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const decrementCount = async (req, res) => {
    const { cartId, itemId } = req.params;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find((i) => i.itemId.toString() === itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (item.count > 1) {
            item.count -= 1;
        } else {
            return res.status(400).json({ message: 'Count cannot go below 1' });
        }

        await cart.save();

        res.status(200).json({ message: 'Item count decremented', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const calculateCartTotal = async (req, res) => {
    const userId = req.user._id;

    try {

        const cart = await Cart.findOne({ userId }).populate('items.itemId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const total = cart.items.reduce((sum, item) => {
            const itemPrice = item.itemId.price || 0;
            return sum + itemPrice * item.count;
        }, 0);

        const CGST = (total * 2.5) / 100;
        const SGST = (total * 2.5) / 100;

        const payableAmount = total + CGST + SGST;

        res.status(200).json({
            total,
            CGST: CGST.toFixed(2),
            SGST: SGST.toFixed(2),
            payableAmount: payableAmount.toFixed(2),
            createdAt: cart.createdAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { addToCart, getCart, removeFromCart, incrementCount, decrementCount, calculateCartTotal };