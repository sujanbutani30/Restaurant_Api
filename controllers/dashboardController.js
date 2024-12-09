const Order = require('../models/Order');
const Cart = require('../models/cart');
const Item = require('../models/item');

const getTotalOrderToday = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalOrderToday = await Order.countDocuments({
            createdAt: { $gte: today },
        });

        res.status(200).json({ success: true, totalOrderToday });
    } catch (error) {
        console.error('Error fetching total orders for today:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getOrderTypeCounts = async (req, res) => {
    try {
        const parcelOrderCount = await Order.countDocuments({ type: 'Parcel' });
        const onsiteOrderCount = await Order.countDocuments({ type: 'Onsite' });

        res.status(200).json({
            success: true,
            data: {
                totalParcelOrder: parcelOrderCount,
                totalOnsiteOrder: onsiteOrderCount,
            },
        });
    } catch (error) {
        console.error('Error fetching order type counts:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getTodayRevenue = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const ordersToday = await Order.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).populate('cartId');

        let totalRevenue = 0;

        for (let order of ordersToday) {
            if (!order.cartId) {
                console.warn(`Order ${order._id} does not have a valid cartId.`);
                continue;
            }

            const cart = await Cart.findById(order.cartId._id).populate('items.itemId');
            if (!cart) {
                console.warn(`Cart ${order.cartId._id} not found.`);
                continue;
            }

            const cartTotal = cart.items.reduce((sum, item) => {
                const itemPrice = item.itemId.price || 0;
                return sum + itemPrice * item.count;
            }, 0);

            const CGST = (cartTotal * 2.5) / 100;
            const SGST = (cartTotal * 2.5) / 100;
            const payableAmount = cartTotal + CGST + SGST;

            totalRevenue += payableAmount;
        }

        res.status(200).json({
            message: 'Today\'s revenue retrieved successfully.',
            totalRevenue: totalRevenue.toFixed(2),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMonthWiseOrders = async (req, res) => {
    try {
        const monthWiseOrders = await Order.aggregate([
            {
                $project: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    customervisit: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    customervisit: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            monthWiseOrders,
        });
    } catch (error) {
        console.error('Error fetching month-wise orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getPopularDishes = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'cartId',
                populate: {
                    path: 'items.itemId',
                    model: 'Item',
                },
            })
            .exec();

        const dishPopularity = {};

        orders.forEach(order => {
            order.cartId.items.forEach(item => {
                const itemId = item.itemId._id.toString();
                if (!dishPopularity[itemId]) {
                    dishPopularity[itemId] = {
                        name: item.itemId.name,
                        price: item.itemId.price,
                        category: item.itemId.category,
                        image: item.itemId.image,
                        createdAt: item.itemId.createdAt,
                        orderCount: 0,
                    };
                }
                dishPopularity[itemId].orderCount++;
            });
        });

        const popularDishes = Object.values(dishPopularity);

        popularDishes.sort((a, b) => b.orderCount - a.orderCount);

        res.status(200).json({
            success: true,
            popularDishes: popularDishes,
        });
    } catch (error) {
        console.error('Error fetching popular dishes:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = { getTotalOrderToday, getOrderTypeCounts, getTodayRevenue, getTodayRevenue, getMonthWiseOrders, getPopularDishes };