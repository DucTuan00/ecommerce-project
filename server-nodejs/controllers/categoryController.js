const categoryModel = require('../models/categoryModel');

// Xem tất cả các category
exports.getCategories = (req, res) => {
    categoryModel.getAllCategories((err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching categories' });
        res.json(results);
    });
};

// Thêm category
exports.createCategory = (req, res) => {
    const { name } = req.body;

    categoryModel.createCategory(name, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error creating category' });
        res.status(201).json({
            id: results.insertId,
            name: name,
            message: 'Category created successfully'
        });
    });
};

// Sửa category
exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    categoryModel.updateCategory(id, name, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error updating category' });
        res.json({ message: 'Category updated successfully' });
    });
};

// Xóa category
exports.deleteCategory = (req, res) => {
    const { id } = req.params;

    categoryModel.deleteCategory(id, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error deleting category' });
        res.json({ message: 'Category deleted successfully' });
    });
};