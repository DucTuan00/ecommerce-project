const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy danh sách đơn hàng của người dùng hiện tại
router.get('/', authMiddleware(['1','2']), orderController.getUserOrders);

router.get('/:id', authMiddleware(['1','2']), orderController.getOrderById);

router.post('/', authMiddleware(['2']), orderController.createOrder);

router.get('/items/:id', authMiddleware(['1','2']), orderController.getAllOrderItemsByOrderId);

router.put('/:id', authMiddleware(['1','2']), orderController.updateOrderStatus);

router.put('/:id', authMiddleware(['1','2']), orderController.updateOrderStatus);

router.get('/getAll', authMiddleware(['1', '2']), orderController.getUserOrders);

module.exports = router;
