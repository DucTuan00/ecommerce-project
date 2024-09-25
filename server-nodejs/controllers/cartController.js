const cartModel = require('../models/cartModel');
const authModel = require('../models/authModel');
const productModel = require('../models/productModel');

exports.createCart = (req, res) => {
    const { user_id } = req.params;
    const { product_id, quantity } = req.body;

    // Kiểm tra người dùng có tồn tại không
    authModel.getUserById(user_id, (err, userExists) => {
        if (err) return res.status(500).json({ message: 'Error checking user' });
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        // Kiểm tra sản phẩm có tồn tại không
        productModel.getProductById(product_id, (err, productExists) => {
            if (err) return res.status(500).json({ message: 'Error checking product' });
            if (!productExists) return res.status(404).json({ message: 'Product not found' });

            const total_money = productExists.price * quantity;

            cartModel.createCart(user_id, product_id, quantity, total_money, (err, result) => {
                if (err) return res.status(500).json({ message: 'Error creating cart' });
                res.status(201).json({
                    user_id,
                    product_id,
                    quantity,
                    total_money,
                });
            });
        });
    });
};

// Sửa giỏ hàng
exports.updateCart = (req, res) => {
    const user_id = req.params.user_id || req.params[0];
    const id = req.params.id || req.params[1];
    const { product_id, quantity } = req.body;

    // Kiểm tra người dùng có tồn tại không
    authModel.getUserById(user_id, (err, userExists) => {
        if (err) return res.status(500).json({ message: 'Error checking user' });
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        // Kiểm tra sản phẩm có tồn tại không
        productModel.getProductById(product_id, (err, productExists) => {
            if (err) return res.status(500).json({ message: 'Error checking product' });
            if (!productExists) return res.status(404).json({ message: 'Product not found' });

            const total_money = productExists.price * quantity;

            cartModel.getCartById(id, (err, cart) => {
                if (err) return res.status(500).json({ message: 'Error fetching cart' });
                if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
                // Nếu cart là một mảng, lấy phần tử đầu tiên
                const cartData = Array.isArray(cart) ? cart[0] : cart;

                // Kiểm tra để đảm bảo giỏ hàng đúng người sở hữu
                if (parseInt(cartData.user_id) !== parseInt(user_id)) {
                    return res.status(403).json({ message: 'You do not have permission to delete this cart' })
                }

                cartModel.updateCart(id, user_id, product_id, quantity, total_money, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Error updating cart' });
                    res.status(200).json({
                        user_id,
                        product_id,
                        quantity,
                        total_money,
                    });
                });
            });
        });
    });
};

// Xóa giỏ hàng
exports.deleteCart = (req, res) => {
    const user_id = req.params.user_id || req.params[0];
    const id = req.params.id || req.params[1];

    // Kiểm tra người dùng có tồn tại không
    authModel.getUserById(user_id, (err, userExists) => {
        if (err) return res.status(500).json({ message: 'Error checking user' });
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        cartModel.getCartById(id, (err, cart) => {
            if (err) return res.status(500).json({ message: 'Error fetching cart' });
            if (!cart) return res.status(404).json({ message: 'Cart not found' });

            // Nếu cart là một mảng, lấy phần tử đầu tiên
            const cartData = Array.isArray(cart) ? cart[0] : cart;

            // Kiểm tra để đảm bảo giỏ hàng đúng người sở hữu
            if (parseInt(cartData.user_id) !== parseInt(user_id)) {
                return res.status(403).json({ message: 'You do not have permission to delete this cart' })
            }

            cartModel.deleteCart(id, user_id, (err, result) => {
                if (err) return res.status(500).json({ message: 'Error deleting from cart' });
                res.status(200).json({ message: `Delete cart with id: ${id}` });
            });
        });
    });
};

// Lấy tất cả giỏ hàng từ id người dùng
exports.getCart = (req, res) => {
    const { user_id } = req.params;

    // Kiểm tra người dùng có tồn tại không
    authModel.getUserById(user_id, (err, userExists) => {
        if (err) return res.status(500).json({ message: 'Error checking user' });
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        cartModel.getCartByUserId(user_id, (err, cartItems) => {
            if (err) return res.status(500).json({ message: 'Error fetching cart' });
            res.status(200).json(cartItems);
        });
    });
};