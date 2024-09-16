const authModel = require('../models/authModel');

// Đăng ký
exports.register = (req, res) => {
    const { username, password, role_id } = req.body;
    console.log("register")
    const userRoleId = role_id || 2;

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
    console.log("login")

    authModel.login(username, password, (err, user) => {
        if (err) {
            if (err.message === 'Có lỗi trong quá trình đăng nhập') {
                return res.status(401).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Có lỗi trong quá trình đăng nhập' });
        }

        //  // Phát token vào cookie
        //  res.cookie('token', user.token, {
        //     httpOnly: false,  
        //     secure: false,    
        //     sameSite: 'none', 
        //     maxAge: 24 * 60 * 60 * 1000 
        // });

        res.json({
            id: user.id,
            role: user.role_id,
            token: user.token
        });
    });
};