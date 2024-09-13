const express = require('express');
const multer = require('multer');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu trữ ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên file
    }
});

const upload = multer({ storage });

router.get('/', productController.getProducts);

router.post('/', authMiddleware(['1']), productController.createProduct);

//upload ảnh
router.post('/upload', authMiddleware(['1']), upload.single('image'), productController.uploadImage);

router.put('/:id', authMiddleware(['1']), productController.updateProduct);

router.delete('/:id', authMiddleware(['1']), productController.deleteProduct);

module.exports = router;