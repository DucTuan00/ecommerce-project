const db = require('../config/db');

// Hàm lấy tổng số tiền theo tháng trong một năm
const getTotalAmountByYear = (year, callback) => {
    const sql = `
        SELECT 
            MONTH(created_at) AS month, 
            SUM(total_amount) AS total_amount
        FROM orders 
        WHERE YEAR(created_at) = ?
        GROUP BY MONTH(created_at)
        ORDER BY MONTH(created_at);
    `;
    db.query(sql, [year], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

module.exports = {
    getTotalAmountByYear,
};
