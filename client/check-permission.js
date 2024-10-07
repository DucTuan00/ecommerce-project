// nav.js
const checkAndDisplayProductLink = () => {

    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

    // Nếu userId là '1', hiển thị link "Sản phẩm"
    if (userId === '1') {
        document.getElementById('product-link').style.display = 'block';
    } else {
        document.getElementById('product-link').style.display = 'none';
    }
};

// Load nội dung của file nav.html vào element #nav-container
fetch('../nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-container').innerHTML = data;
        // Call the checkAndDisplayProductLink function sau khi nội dung đã được load
        checkAndDisplayProductLink();
    });