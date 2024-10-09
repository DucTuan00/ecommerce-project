const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy danh sách đơn hàng của người dùng hiện tại
router.get('/', authMiddleware(['1','2']), orderController.getUserOrders);
router.get('/:id', authMiddleware(['1','2']), orderController.getOrderById);
router.post('/', authMiddleware(['2']), orderController.createOrder);
router.get('/items/:order_id', authMiddleware(['2']), orderController.getAllOrderItemsByOrderId);

module.exports = router;
