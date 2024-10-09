const orderModel = require('../models/orderModel');
const authModel = require('../models/authModel');

// Lấy danh sách đơn hàng của người dùng hiện tại
exports.getUserOrders = (req, res) => {
    console.log('req.userId:', req.userId);
    const user_id = req.userId;

    // Kiểm tra người dùng có tồn tại không
    authModel.getUserById(user_id, (err, userExists) => {
        if (err) return res.status(500).json({ message: 'Error checking user' });
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        // Lấy danh sách đơn hàng theo user_id
        orderModel.getOrdersByUserId(user_id, (err, orders) => {
            if (err) return res.status(500).json({ message: 'Error fetching orders' });
            res.status(200).json(orders);
        });
    });
};
