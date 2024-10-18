const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const statisticalController = require('../controllers/statisticalController');

router.post('/', authMiddleware(['1','2']), statisticalController.getTotalAmountByYear);

module.exports = router;
