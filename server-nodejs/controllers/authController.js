const authModel = require('../models/authModel');

// Đăng ký
exports.register = (req, res) => {
    const { username, password, role_id } = req.body;

    authModel.register(username, password, role_id, (err, user) => {
        if (err) return res.status(500).json({ message: 'Error registering user' });
        res.status(201).json({
            id: user.id,
            username: user.username,
            message: 'User registered successfully'
        });
    });
};

// Đăng nhập
exports.login = (req, res) => {
    const { username, password } = req.body;

    authModel.login(username, password, (err, user) => {
        if (err) {
            if (err.message === 'Invalid credentials') {
                return res.status(401).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Error logging in' });
        }
        res.json({
            id: user.id,
            role: user.role_id,
            token: user.token
        });
    });
};