const db = require('../config/db');

const createCart = (user_id, product_id, quantity, total_money, callback) => {
    db.query('INSERT INTO carts (user_id, product_id, quantity, total_money) VALUES (?, ?, ?, ?)', 
        [user_id, product_id, quantity, total_money], callback);
};

const updateCart = (id, user_id, product_id, quantity, total_money, callback) => {
    db.query('UPDATE carts SET quantity = ?, total_money = ? WHERE user_id = ? AND id = ? AND product_id = ?', 
        [quantity, total_money, user_id, id, product_id], callback);
};

const deleteCart = (id, user_id, callback) => {
    db.query('DELETE FROM carts WHERE id = ? AND user_id = ?', 
        [id, user_id], callback);
};

const getCartByUserId = (user_id, callback) => {
    db.query('SELECT * FROM carts WHERE user_id = ?', [user_id], callback);
};

const getCartById = (id, callback) => {
    db.query('SELECT * FROM carts WHERE id = ?', [id], callback);
}

module.exports = {
    createCart,
    updateCart,
    deleteCart,
    getCartByUserId,
    getCartById
};