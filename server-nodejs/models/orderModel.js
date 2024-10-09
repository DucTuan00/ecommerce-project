const db = require('../config/db');

// Lấy tất cả đơn hàng của người dùng
const getOrdersByUserId = (user_id, callback) => {
    const sql = 'SELECT * FROM orders WHERE user_id = ?';
    db.query(sql, [user_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

module.exports = {
    getOrdersByUserId,
};
