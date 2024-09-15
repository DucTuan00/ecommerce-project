const db = require('../config/db');

// Lấy tất cả sản phẩm
const getAllProducts = (callback) => {
    db.query('SELECT * FROM products', callback);
};

// Thêm sản phẩm mới
const createProduct = (name, price, image, description, category_id, callback) => {
    db.query('INSERT INTO products (name, price, image, description, category_id) VALUES (?, ?, ?, ?, ?)', 
        [name, price, image, description, category_id], callback);
};

// Cập nhật sản phẩm
const updateProduct = (id, name, price, image, description, category_id, callback) => {
    db.query('UPDATE products SET name = ?, price = ?, image = ?, description = ?, category_id = ? WHERE id = ?', 
        [name, price, image, description, category_id, id], callback);
};

// Xóa sản phẩm
const deleteProduct = (id, callback) => {
    db.query('DELETE FROM products WHERE id = ?', [id], callback);
};

// Tìm kiếm sản phẩm
const searchProducts = (searchTerm, callback) => {
    const sql = `SELECT * FROM products WHERE name LIKE ? OR description LIKE ?`;
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];

    db.query(sql, params, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
};