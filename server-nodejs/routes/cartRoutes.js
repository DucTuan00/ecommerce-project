const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['2']), cartController.createCart);

router.put('/:id', authMiddleware(['2']), cartController.updateCart);

router.delete('/:id', authMiddleware(['2']), cartController.deleteCart);

router.get('/', authMiddleware(['2']), cartController.getCart);

module.exports = router;