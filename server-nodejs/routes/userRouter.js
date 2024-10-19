const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/allUser', authMiddleware(['1']), userController.getAllUsers);

router.delete('/delete/:id', authMiddleware(['1']), userController.deleteUser);

router.put('/update/:id', userController.updateUser);

router.get('/getUser/:id', userController.getUserById);

module.exports = router;
