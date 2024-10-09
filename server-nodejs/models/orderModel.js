const db = require('../config/db');

// Lấy tất cả đơn hàng của người dùng
const getOrdersByUserId = (user_id, callback) => {
    const sql = 'SELECT * FROM orders WHERE user_id = ?';
    db.query(sql, [user_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const createOrder = (user_id, total_amount, status, callback) => {
    db.query('INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)', 
        [user_id, total_amount, status], callback);
};

// Hàm thêm sản phẩm vào order_items
const addOrderItems = (order_id, product_id, quantity, price, callback) => {
    db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', 
        [order_id, product_id, quantity, price], callback);
};

const getAllOrderItemsByOrderId = (order_id, callback) => {
    db.query('SELECT * FROM order_items WHERE order_id = ?', [order_id], callback);
}

const getOrderById = (id, callback) => {
    db.query('SELECT * FROM orders WHERE id = ?', [id], callback);
}

module.exports = {
    getOrdersByUserId,
    createOrder,
    addOrderItems,
    getAllOrderItemsByOrderId,
    getOrderById
};
