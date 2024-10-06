document.addEventListener('DOMContentLoaded', function () {
    let products = []; // Biến để lưu tất cả dữ liệu sản phẩm từ BE
    const itemsPerPage = 5; // Số bản ghi mỗi trang
    let currentPage = 1; // Trang hiện tại
    let isLoading = true; // Biến theo dõi trạng thái loading

    // Khi dữ liệu đang tải, hiển thị chỉ báo loading
    function renderLoading() {
        const productTableBody = document.getElementById('productTableBody');
        productTableBody.innerHTML = '<tr><td colspan="7">Đang tải dữ liệu...</td></tr>';
    }

    // Gọi API để lấy danh sách sản phẩm
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            products = data; // Lưu dữ liệu vào biến
            isLoading = false;
            renderTable(); // Render bảng với dữ liệu ban đầu
            renderPagination(); // Tạo các nút phân trang
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });

    function renderTable() {
        const productTableBody = document.getElementById('productTableBody');
        productTableBody.innerHTML = ''; // Xóa nội dung cũ

        // Nếu đang tải hoặc không có sản phẩm nào
        if (isLoading) {
            renderLoading();
            return;
        } else if (products.length === 0) {
            productTableBody.innerHTML = '<tr><td colspan="7 ">Không có sản phẩm nào.</td></tr>';
            return;
        }

        // Tính toán bản ghi bắt đầu và kết thúc cho trang hiện tại
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const productsToShow = products.slice(start, end);

        // Tạo các hàng cho sản phẩm trong phạm vi này
        productsToShow.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td class="select-product"><input type="checkbox" class="select-item"></td>
        <td class="actions-btn">
            <a href="../editProduct/editProduct.html?id=${product.id}" class="edit-btn">
                <i class="fas fa-edit"></i>
            </a>
        </td>
        <td>${product.name}</td>
        <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
        <td>${product.category_id || 'Không xác định'}</td>
        <td>${product.description}</td>
    `;
            productTableBody.appendChild(row);
        });
    }

    function renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = ''; // Xóa nội dung cũ

        const totalPages = Math.ceil(products.length / itemsPerPage);

        // Tạo các nút phân trang
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-btn');
            if (i === currentPage) {
                pageButton.classList.add('active'); // Đánh dấu trang hiện tại
            }

            // Thêm sự kiện khi bấm vào nút trang
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderTable(); // Render lại bảng khi trang thay đổi
                updateActivePagination(); // Cập nhật lại trạng thái active cho nút trang
            });

            paginationContainer.appendChild(pageButton);
        }
    }

    // Hàm cập nhật trạng thái active cho nút phân trang
    function updateActivePagination() {
        const pageButtons = document.querySelectorAll('.page-btn');
        pageButtons.forEach((button, index) => {
            // Xóa tất cả class 'active' trước
            button.classList.remove('active');
            // Chỉ thêm class 'active' cho nút của trang hiện tại
            if (index + 1 === currentPage) {
                button.classList.add('active');
            }
        });
    }
});