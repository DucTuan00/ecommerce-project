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

// Cập nhật thông tin người dùng
const updateUser = (id, updatedUser, callback) => {
    const { email, birthday } = updatedUser;  // Lấy email và birthday
    const sql = `
        UPDATE users 
        SET email = ?, birthday = ?
        WHERE id = ?
    `;
    db.query(sql, [email, birthday, id], callback);
};

const getUserById = (userId, callback) => {
    const sql = `
        SELECT users.id, users.username, users.email, users.birthday, roles.name AS role
        FROM users
        JOIN roles ON users.role_id = roles.id
        WHERE users.id = ?
    `;
    db.query(sql, [userId], callback);
};


module.exports = {
    getAllUsers,
    deleteUser,
    updateUser,
    getUserById,
};
