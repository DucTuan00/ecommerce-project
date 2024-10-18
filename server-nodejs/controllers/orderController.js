const orderModel = require('../models/orderModel');
const authModel = require('../models/authModel');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

// Lấy danh sách đơn hàng của người dùng hiện tại
exports.getUserOrders = (req, res) => {
    const user_id = req.userId;

    // Kiểm tra người dùng có tồn tại không
    authModel.getUserById(user_id, (err, userExists) => {
        if (err) return res.status(500).json({ message: 'Error checking user' });
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        // Lấy danh sách đơn hàng theo user_id
        orderModel.getOrdersByUserId(user_id, (err, orders) => {
            if (err) return res.status(500).json({ message: 'Error fetching orders' });
            res.status(200).json(orders);
        });
    });
};

exports.createOrder = (req, res) => {
    const user_id = req.userId;
    const { phone_number, address } = req.body;
    const status = "pending";

    // Lấy giỏ hàng của người dùng
    cartModel.getCartByUserId(user_id, (err, cartItems) => {
        if (err) return res.status(500).json({ message: 'Error fetching cart' });
        if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

        // Kiểm tra từng sản phẩm trong giỏ hàng
        const promises = cartItems.map(item => {
            return new Promise((resolve, reject) => {
                productModel.getProductById(item.product_id, (err, product) => {
                    if (err) return reject(err);
                    if (!product) return reject(new Error('Product not found'));

                    // Kiểm tra số lượng sản phẩm trong kho
                    if (product.quantity < item.quantity) {
                        return reject(new Error(`Not enough stock for product ID ${item.product_id}`));
                    }

                    // Cập nhật số lượng sản phẩm
                    productModel.updateProductQuantity(item.product_id, item.quantity, (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
        });

        // Chờ tất cả các sản phẩm được kiểm tra và cập nhật
        Promise.all(promises)
            .then(() => {
                // Tính tổng tiền
                const total_amount = cartItems.reduce((sum, item) => sum + item.total_money, 0);

                // Tạo đơn hàng
                orderModel.createOrder(user_id, total_amount, status, phone_number, address, (err, orderResult) => {
                    if (err) return res.status(500).json({ message: 'Error creating order' });

                    const order_id = orderResult.insertId; // Lấy ID của đơn hàng mới tạo

                    // Thêm các sản phẩm vào order_items
                    const orderItemsPromises = cartItems.map(item => {
                        return new Promise((resolve, reject) => {
                            orderModel.addOrderItems(order_id, item.product_id, item.quantity, item.total_money, (err) => {
                                if (err) return reject(err);
                                resolve();
                            });
                        });
                    });

                    // Chờ tất cả các sản phẩm được thêm vào order_items
                    Promise.all(orderItemsPromises)
                        .then(() => {
                            // Xóa giỏ hàng của người dùng
                            cartModel.clearCart(user_id, (err) => {
                                if (err) return res.status(500).json({ message: 'Error clearing cart' });
                                res.status(201).json({ message: 'Order created successfully', order_id });
                            });
                        })
                        .catch(err => {
                            res.status(500).json({ message: 'Error adding order items' });
                        });
                });
            })
            .catch(err => {
                res.status(400).json({ message: err.message }); // Trả về lỗi nếu không đủ hàng
            });
    });
};

exports.getAllOrderItemsByOrderId = (req, res) => {
    const order_id = req.params.id;

    orderModel.getAllOrderItemsByOrderId(order_id, (err, orderItems) => {
        if (err) return res.status(500).json({ message: 'Error fetching order items' });
        if (orderItems.length === 0) return res.status(404).json({ message: 'No order items found' });

        res.status(200).json(orderItems);
    });
};

exports.getOrderById = (req, res) => {
    const id = req.params.id;

    orderModel.getOrderById(id, (err, result) => {
        if (err) return res.status(500).json({message: 'Cannot get order'});
        res.status(200).json(result);
    });
};

exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    orderModel.updateOrderStatus(orderId, status, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating order status' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order status updated successfully' });
    });
};

exports.getAllOrders = (req, res) => {
    console.log('getAllOrders called');
    console.log('Request object:', req.method, req.url, req.params, req.query);

    orderModel.getAllOrders((err, orders) => {
        console.log('Inside getAllOrders callback');
        if (err) {
            console.error('Error fetching all orders:', err);
            return res.status(500).json({ message: 'Error fetching orders' });
        }
        console.log('All orders fetched:', orders);
        res.status(200).json(orders);
    });
};
