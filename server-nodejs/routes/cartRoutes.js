const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:user_id', authMiddleware(['2']), cartController.createCart);

router.put('/:user_id/:id', authMiddleware(['2']), cartController.updateCart);

router.delete('/:user_id/:id', authMiddleware(['2']), cartController.deleteCart);

router.get('/:user_id', authMiddleware(['2']), cartController.getCart);

module.exports = router;