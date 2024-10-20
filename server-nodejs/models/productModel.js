const db = require('../config/db');

// Lấy tất cả sản phẩm
const getAllProducts = (callback) => {
    db.query('SELECT * FROM products', callback);
};

const getProductById = (product_id, callback) => {
    db.query('SELECT * FROM products WHERE id = ?', [product_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results.length > 0 ? results[0] : null);
    });
};

// Thêm sản phẩm mới
const createProduct = (name, price, image, description, category_id, quantity, active, callback) => {
    db.query('INSERT INTO products (name, price, image, description, category_id, quantity, active) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [name, price, image, description, category_id, quantity, active], callback);
};

// Cập nhật sản phẩm
const updateProduct = (id, name, price, image, description, category_id, quantity, callback) => {
    db.query('UPDATE products SET name = ?, price = ?, image = ?, description = ?, category_id = ?, quantity = ? WHERE id = ?', 
        [name, price, image, description, category_id, quantity, id], callback);
};

const updateProductWithoutImage = (id, name, price, description, category_id, quantity, callback) => {
    db.query('UPDATE products SET name = ?, price = ?, description = ?, category_id = ?, quantity = ? WHERE id = ?', 
        [name, price, description, category_id, quantity, id], callback);
};

// Xóa sản phẩm
const deleteProduct = (id, callback) => {
    db.query('UPDATE products SET active = 0 WHERE id = ?', [id], callback);
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

// Hàm kiểm tra và cập nhật số lượng sản phẩm
const updateProductQuantity = (product_id, quantity, callback) => {
    db.query('UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?', 
        [quantity, product_id, quantity], callback);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    searchProducts,
    updateProductQuantity,
    updateProductWithoutImage,
};