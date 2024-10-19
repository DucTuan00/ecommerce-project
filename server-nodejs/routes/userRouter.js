const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/allUser', authMiddleware(['1']), userController.getAllUsers);

router.delete('/delete/:id', authMiddleware(['1']), userController.deleteUser);


module.exports = router;
