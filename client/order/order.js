document.addEventListener("DOMContentLoaded", function () {
    // Lấy token từ cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    const Token = token ? token.split('=')[1] : '';

    // Lấy userId từ localStorage
    const userRole = localStorage.getItem('userRole');


    function fetchOrders() {
        let apiUrl = '';

        console.log(userRole);

        // Kiểm tra userRole để chọn URL API phù hợp
        if (userRole === '1') {
            apiUrl = 'http://localhost:3000/api/orders/getAll';
        } else if (userRole === '2') {
            apiUrl = 'http://localhost:3000/api/orders';
        }

        // Gọi API
        if (apiUrl) {
            fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Không thể lấy dữ liệu đơn hàng");
                    }
                    return response.json();
                })
                .then(orders => {
                    renderOrderTable(orders);
                })
                .catch(error => {
                    console.error("Lỗi khi lấy đơn hàng:", error);
                });
        } else {
            console.error("userRole không hợp lệ.");
        }
    }

    // Hàm render dữ liệu vào bảng
    function renderOrderTable(orders) {
        const orderTableBody = document.getElementById("orderTableBody");
        orderTableBody.innerHTML = ""; // Xóa dữ liệu cũ trong bảng

        orders.forEach(order => {
            const tr = document.createElement("tr");

            // Tạo các cột dữ liệu
            tr.innerHTML = `
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
            <td>${order.total_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td>${renderOrderStatus(order.status)}</td>
            <td class="actions-btn">
                ${userRole === '1' ? `<a href="../order-detail/order-detail.html?id=${order.id}" class="edit-btn"><i class="fas fa-edit"></i></a>` : ''}
                ${userRole === '2' ? `<a href="../order-detail/order-detail.html?id=${order.id}" class="edit-btn"><i class="fas fa-eye"></i></a>` : ''}
            </td>
        `;

            orderTableBody.appendChild(tr);
        });
    }

    // Hàm xử lý trạng thái đơn hàng
    function renderOrderStatus(status) {
        switch (status.toLowerCase()) { // Chuyển đổi trạng thái về chữ thường
            case 'pending':
                return 'Chờ xử lý';
            case 'shipped':
                return 'Đã giao hàng';
            case 'completed':
                return 'Hoàn thành';
            case 'canceled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    }

    // Gọi hàm fetchOrders để lấy dữ liệu khi trang vừa load
    fetchOrders();
});
