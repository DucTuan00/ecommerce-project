const { log } = require('console');
const productModel = require('../models/productModel');

// Lấy tất cả sản phẩm
exports.getProducts = (req, res) => {
    productModel.getAllProducts((err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching products' });
        res.json(results);
    });
};

// Lấy 1 sản phẩm
exports.getProductById = (req, res) => {
    const { id } = req.params;
    productModel.getProductById(id, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error getting product' });
        res.json(results);
    })
}

// Thêm sản phẩm
exports.createProduct = (req, res) => {
    const { name, price, description, category_id, quantity } = req.body;

        const image = req.files.image ? req.files.image[0] : null;
        const imagePath = image ? image.path : null;

    // console.log("imagePath", imagePath);

    // console.log("data", req.body, req.file); 

    productModel.createProduct(name, price, imagePath, description, category_id, quantity, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error creating product' });
        }

        res.status(201).json({
            id: results.insertId,
            name,
            price,
            imagePath,
            description,
            category_id,
            quantity,
            message: 'Product created successfully'
        });
    });
};

// Cập nhật sản phẩm
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, description, category_id, quantity } = req.body;

    const image = req.files.image ? req.files.image[0] : null;
    const imagePath = image ? image.path : null;


    productModel.updateProduct(id, name, price, imagePath, description, category_id, quantity, (err, results) => {
        if (err) {
            console.error(err); 
            return res.status(500).json({ message: 'Error updating product' });
        }
        res.status(201).json({
            name,
            price,
            imagePath,
            description,
            category_id,
            quantity
        });
    });
};

// Xóa sản phẩm
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    productModel.deleteProduct(id, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error deleting product' });
        res.json({ message: 'Product deleted successfully' });
    });
};

// Upload ảnh
exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Lưu đường dẫn ảnh
    const imagePath = req.file.path;

    res.status(201).json({
        message: 'Image uploaded successfully',
        imagePath,
    });
};

// Tìm kiếm sản phẩm
exports.searchProducts = (req, res) => {
    const { term } = req.body; // Lấy trực tiếp term từ req.body
    console.log('searchTerm:', term); // In ra giá trị của searchTerm để kiểm tra

    if (term) {
        // Nếu có term, tìm kiếm sản phẩm theo tên hoặc mô tả
        productModel.searchProducts(term, (err, products) => {
            if (err) {
                console.error('Error searching products:', err);
                return res.status(500).json({ message: 'Error searching products' });
            }

            if (products.length === 0) {
                // Nếu không có sản phẩm nào, trả về thông báo
                return res.status(404).json({ message: 'Không có sản phẩm nào' });
            }

            // Trả về danh sách sản phẩm tìm được
            return res.status(200).json(products);
        });
    } else {
        // Nếu không có term, trả về tất cả sản phẩm
        productModel.getAllProducts((err, products) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ message: 'Error fetching products' });
            }
            return res.status(200).json(products);
        });
    }
};
