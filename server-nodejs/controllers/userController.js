const userModel = require('../models/userModel');

// Lấy danh sách tất cả người dùng
exports.getAllUsers = (req, res) => {
    userModel.getAllUsers((err, users) => {
        if (err) {
            console.error('Error fetching all users:', err);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.status(200).json(users);
    });
};

// Xóa người dùng
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    userModel.deleteUser(id, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error deleting product' });
        res.json({ message: 'Product deleted successfully' });
    });
};

// Cập nhật thông tin người dùng
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { email, birthday } = req.body;  // Chỉ lấy email và birthday

    // Tạo đối tượng người dùng để cập nhật
    const updatedUser = {
        email,
        birthday
    };

    userModel.updateUser(id, updatedUser, (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ message: 'Lỗi cập nhật người dùng' });
        }
        res.json({ message: 'Cập nhật thông tin cá nhân thành công' });
    });
};

exports.getUserById = (req, res) => {
    const userId = req.params.id; // Lấy userId từ params

    // Kiểm tra người dùng có tồn tại không
    userModel.getUserById(userId, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    });
};