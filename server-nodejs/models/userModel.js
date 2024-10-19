const db = require('../config/db');

// Lấy danh sách tất cả người dùng
const getAllUsers = (callback) => {
    const sql = `
        SELECT users.id, users.username, roles.name AS role, email, birthday
        FROM users
        JOIN roles ON users.role_id = roles.id
    `;
    db.query(sql, callback);
};

const deleteUser = (id, callback) => {
    db.query('DELETE FROM users WHERE id = ?', [id], callback);
};

module.exports = {
    getAllUsers,
    deleteUser,
};
