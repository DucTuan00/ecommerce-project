// Hàm để lấy giá trị của cookie theo tên
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

// Biến toàn cục để lưu danh sách sản phẩm
let productList = [];

// Kiểm tra token khi trang load
window.onload = function() {
    const token = getCookie('token'); // Lấy cookie có tên 'token'

    if (!token) {
        // Chuyển hướng tới trang login nếu không có token
        window.location.href = '../login/login.html';
    } else {
        // Nếu có token, bắt đầu slideshow và fetch sản phẩm
        initSlideshow();
        fetchProducts(); // Lấy tất cả sản phẩm khi tải trang
    }
};

// JavaScript to handle the slideshow functionality
let slideIndex = 0;
const slides = [
    'https://samnec.com.vn/uploads/tin-tuc/2022-12-08-15-56-0316.9.png',
    'https://www.bigc.vn/files/banners/april/may/bigc-flashhsalegiadung-resize-cover-blog-go.png',
    'https://doanhnghiepvathuongmai.vn/public/storage/uploads/images/LocknLock-%20B%E1%BA%AFc%20Ninh%201.jpg',
];

function showSlides() {
    const slideshow = document.querySelector('.slideshow img');
    slideIndex = (slideIndex + 1) % slides.length;
    slideshow.src = slides[slideIndex];
}

function initSlideshow() {
    // Change slide every 3 seconds
    setInterval(showSlides, 3000);
}

// Hàm fetch dữ liệu sản phẩm từ API
function fetchProducts() {
    fetch('http://localhost:3000/api/products', {
        headers: {
            'Authorization': `Bearer ${getCookie('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        productList = data; // Lưu tất cả sản phẩm vào mảng
        renderProducts(productList); // Hiển thị sản phẩm ban đầu
    })
    .catch(error => {
        console.error('Lỗi khi gọi API:', error);
    });
}

// Hàm render sản phẩm
function renderProducts(products) {
    const productsContainer = document.querySelector('.products-container');
    productsContainer.innerHTML = ''; // Xóa nội dung hiện tại

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        const productImage = document.createElement('img');
        productImage.src = `../../server-nodejs/${product.image}`; 
        productImage.alt = product.name;

        const productName = document.createElement('div');
        productName.classList.add('product-name');
        productName.textContent = product.name;

        const productPrice = document.createElement('div');
        productPrice.classList.add('product-price');
        productPrice.textContent = `${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;

        // Gắn sự kiện click để chuyển hướng
        productItem.addEventListener('click', function() {
            window.location.href = `../viewProduct/viewProduct.html?id=${product.id}`;
        });

        productItem.appendChild(productImage);
        productItem.appendChild(productName);
        productItem.appendChild(productPrice);

        productsContainer.appendChild(productItem);
    });
}

// Thêm sự kiện click vào các thẻ .category-card
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const categoryId = card.getAttribute('data-category-id'); // Lấy ID loại sản phẩm
        
        // Gọi API để lấy sản phẩm theo loại tương ứng
        fetch(`http://localhost:3000/api/categories/${categoryId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            productList = data; // Cập nhật danh sách sản phẩm
            renderProducts(productList); // Hiển thị sản phẩm theo loại
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });
    });
});


// Hàm để tìm kiếm sản phẩm
function searchProducts(term) {
    console.log('Sending search term to API:', term); // Log the search term
    fetch(`http://localhost:3000/api/products/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify({ term }),
    })
    .then(response => {
        if (!response.ok) {
            alert('Không tìm thấy sản phẩm nào');
            fetchProducts();
        }
        return response.json();
    })
    .then(data => {
        productList = data; // Cập nhật danh sách sản phẩm
        renderProducts(productList); // Hiển thị sản phẩm tìm được
    })
    .catch(error => {
        console.error('Lỗi khi gọi API tìm kiếm:', error);
    });
}

// Lấy phần tử input và nút tìm kiếm
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Thêm sự kiện click cho nút tìm kiếm
searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim(); // Lấy giá trị từ input và loại bỏ khoảng trắng
    if (searchTerm) { // Kiểm tra nếu từ khóa không rỗng
        searchProducts(searchTerm); // Gọi hàm tìm kiếm với giá trị tìm kiếm
    } else {
        console.log('Vui lòng nhập từ khóa tìm kiếm.');
    }
});
