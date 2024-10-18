const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Đăng ký
const register = (username, password, role_id, callback) => {
    // Kiểm tra xem username đã tồn tại chưa
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return callback(err);

        // Nếu username đã tồn tại
        if (results.length > 0) {
            return callback(new Error('Username already exists'));
        }

        // Nếu chưa tồn tại, tiếp tục quá trình đăng ký
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return callback(err);

            db.query('INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)', [username, hash, role_id], (err, results) => {
                if (err) return callback(err);
                callback(null, { id: results.insertId, username });    
            });
        });
    });
};

//Đăng nhập
const login = (username, password, callback) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if(err) return callback(err);
        if(results.length === 0) return callback(new Error('Invalid credentials'));

        const user = results[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if(err) return callback(err);
            if(!match) return callback(new Error('Invalid credentials'));

            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '5h' });
            callback(null, { id: user.id, role_id: user.role_id, token });
        });
    });
};

const getUserById = (user_id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [user_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results.length > 0);
    });
};

module.exports = {
    register,
    login,
    getUserById
};