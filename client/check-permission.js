// nav.js
const checkAndDisplayProductLink = () => {

    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

    // Nếu userId là '1', hiển thị link "Sản phẩm"
    if (userId === '1') {
        document.getElementById('product-link').style.display = 'block';
        document.getElementById('statistical-link').style.display = 'block';
    } else {
        document.getElementById('product-link').style.display = 'none';
        document.getElementById('statistical-link').style.display = 'none';
    }
};
