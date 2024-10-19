const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy danh sách đơn hàng của người dùng hiện tại
router.get('/getUserOrder', authMiddleware(['1','2']), orderController.getUserOrders);

router.get('/:id', authMiddleware(['1','2']), orderController.getOrderById);

router.post('/', authMiddleware(['2']), orderController.createOrder);

router.get('/items/:id', authMiddleware(['1','2']), orderController.getAllOrderItemsByOrderId);

router.put('/:id', authMiddleware(['1','2']), orderController.updateOrderStatus);

router.get('/', authMiddleware(['1']), orderController.getAllOrders);

router.put('/cancel/:order_id', authMiddleware(['1','2']), orderController.cancelOrder);

module.exports = router;
