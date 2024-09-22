// Hàm để lấy giá trị của cookie theo tên
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Kiểm tra token khi trang load
window.onload = function() {
    const token = getCookie('token'); // Lấy cookie có tên 'csrftoken'

    if (!token) {
        // Chuyển hướng tới trang login nếu không có token
        window.location.href = '../login/login.html';
    } else {
        // Nếu có token, bắt đầu slideshow
        initSlideshow();
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


document.querySelector('.add-product-icon').addEventListener('click', function() {
    window.location.href = '../addProduct/addProduct.html';
});