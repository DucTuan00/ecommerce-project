const authModel = require('../models/authModel');

exports.register = (req, res) => {
    const { username, password, role_id, birthday, email } = req.body;
    const userRoleId = role_id || 2;

    authModel.register(username, password, userRoleId, birthday, email, (err, user) => {
        if (err) {
            if (err.message === 'Username already exists') {
                return res.status(400).json({ message: 'Username đã tồn tại' });
            }
            return res.status(500).json({ message: 'Lỗi trong quá trình tạo tài khoản' });
        }
        
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
            if (err.message === 'Có lỗi trong quá trình đăng nhập') {
                return res.status(401).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Có lỗi trong quá trình đăng nhập' });
        }

        // Phát token vào cookie
        res.cookie('token', user.token, {
            httpOnly: false, 
            secure: false,  
            sameSite: 'Lax', 
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.json({
            id: user.id,
            role: user.role_id,
            token: user.token
        });
    });
};