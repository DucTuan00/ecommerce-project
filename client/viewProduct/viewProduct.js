// Lấy ID từ URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); // Ví dụ URL là ?id=123 thì lấy được id = 123

// Hàm gọi API và hiển thị thông tin thể loại sản phẩm
async function fetchCategoryDetails(categoryId) {
    try {
        const response = await fetch(`http://localhost:3000/api/categories/category/${categoryId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }
        const category = await response.json();
        console.log(category);

        // Cập nhật nội dung HTML với dữ liệu từ API
        document.querySelector('.product-category').textContent = `Thể loại: ${category.name}`;
    } catch (error) {
        console.error('Error fetching category details:', error);
        // Hiển thị thông báo lỗi (nếu có)
    }
}

// Hàm gọi API và hiển thị thông tin sản phẩm
async function fetchProductDetails() {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        const product = await response.json();
        console.log(product);

        // Cập nhật nội dung HTML với dữ liệu từ API
        document.querySelector('.product-name').textContent = `Tên sản phẩm: ${product.name}`;
        document.querySelector('.product-price').textContent = `Giá: ${product.price} VND`;
        document.querySelector('.product-description').textContent = `Mô tả: ${product.description}`;
        
        // Gọi hàm để lấy thông tin thể loại sản phẩm
        fetchCategoryDetails(product.category_id).then((category) => {
            document.querySelector('.product-category').textContent = `Thể loại: ${category.name}`;
        });
        
        document.querySelector('.product-category').textContent = `Thể loại: ${product.category_id}`;

        // Cập nhật hình ảnh nếu có
        const productImage = document.querySelector('.product-image img');
        productImage.src = `../../server-nodejs/${product.image}`;
        productImage.alt = product.name;
        productImage.style.width = '400px';
        productImage.style.height = '400px';

             // Add event listeners for quantity increment/decrement and Add to Cart button
             const quantityInput = document.querySelector('.quantity-input');
             const decrementButton = document.querySelector('.quantity-decrement');
             const incrementButton = document.querySelector('.quantity-increment');
             const addToCartButton = document.querySelector('.add-to-cart');
     
             decrementButton.addEventListener('click', () => {
                 const currentValue = parseInt(quantityInput.value);
                 if (currentValue > 1) {
                     quantityInput.value = currentValue - 1;
                 }
             });
     
             incrementButton.addEventListener('click', () => {
                 const currentValue = parseInt(quantityInput.value);
                 quantityInput.value = currentValue + 1;
             });
     
             addToCartButton.addEventListener('click', () => {
                 // Add to cart logic here
                 console.log('Add to cart button clicked!');
             });
    } catch (error) {
        console.error('Error fetching product details:', error);
        // Hiển thị thông báo lỗi (nếu có)
    }
}

// Gọi hàm để lấy thông tin sản phẩm khi trang được tải
if (productId) {
    fetchProductDetails();
} else {
    console.error('No product ID found in the URL');
}
