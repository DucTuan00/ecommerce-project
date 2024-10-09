const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy danh sách đơn hàng của người dùng hiện tại
router.get('/', authMiddleware(['1','2']), orderController.getUserOrders);

module.exports = router;
