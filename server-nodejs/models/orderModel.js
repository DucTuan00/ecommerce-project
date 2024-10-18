const db = require('../config/db');

// Lấy tất cả đơn hàng của người dùng
const getOrdersByUserId = (user_id, callback) => {
    const sql = `
        SELECT orders.*, users.username 
        FROM orders 
        JOIN users ON orders.user_id = users.id
        WHERE user_id = ?
    `;
    db.query(sql, [user_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const createOrder = (user_id, total_amount, status, phone_number, address, callback) => {
    db.query('INSERT INTO orders (user_id, total_amount, status, phone_number, address) VALUES (?, ?, ?, ?, ?)', 
        [user_id, total_amount, status, phone_number, address], callback);
};

// Hàm thêm sản phẩm vào order_items
const addOrderItems = (order_id, product_id, quantity, price, callback) => {
    db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', 
        [order_id, product_id, quantity, price], callback);
};

const getAllOrderItemsByOrderId = (order_id, callback) => {
    const query = `
        SELECT oi.*, p.name AS product_name 
        FROM order_items oi 
        INNER JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?`;
    
    db.query(query, [order_id], callback);
}

const getOrderById = (id, callback) => {
    db.query('SELECT * FROM orders WHERE id = ?', [id], callback);
}

const updateOrderStatus = (orderId, status, callback) => {
    const sql = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(sql, [status, orderId], callback);
};

// Lấy tất cả đơn hàng
const getAllOrders = (callback) => {
    const sql = `
        SELECT orders.*, users.username 
        FROM orders 
        JOIN users ON orders.user_id = users.id
    `;
    db.query(sql, callback);
};

const cancelOrder = (order_id, callback) => {
    db.query('UPDATE orders SET status = "canceled" WHERE id = ?', [order_id], callback);
};

module.exports = {
    getOrdersByUserId,
    createOrder,
    addOrderItems,
    getAllOrderItemsByOrderId,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    cancelOrder,
};
