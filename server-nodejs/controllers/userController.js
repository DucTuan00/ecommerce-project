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
