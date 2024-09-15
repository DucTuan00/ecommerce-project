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

// Change slide every 3 seconds
setInterval(showSlides, 3000);
