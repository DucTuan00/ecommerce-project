document.addEventListener("DOMContentLoaded", function () {
    // Lấy token từ cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    const Token = token ? token.split('=')[1] : '';

    // Lấy userId từ localStorage
    const userRole = localStorage.getItem('userRole');

    function fetchOrders() {
        console.log('fetchOrders called');
        let apiUrl = '';
    
        console.log('userRole:', userRole);
    
        // Kiểm tra userRole để chọn URL API phù hợp
        if (userRole === '1') {
            apiUrl = 'http://localhost:3000/api/orders';
        } else if (userRole === '2') {
            apiUrl = 'http://localhost:3000/api/orders/getUserOrder';
        }
    
        console.log('Fetching orders from:', apiUrl);
    
        // Gọi API
        if (apiUrl) {
            fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}` // Đảm bảo token có giá trị hợp lệ
                }
            })
            .then(response => {
                console.log('Response received:', response);
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();  // Chuyển đổi trực tiếp thành JSON
            })
            .then(orders => {
                console.log('Parsed orders:', orders);
                if (orders.length === 0) {
                    console.warn('No orders found.');
                } else {
                    renderOrderTable(orders);  // Hiển thị đơn hàng trong bảng
                }
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
            <td>${order.username}</td>
            <td>${order.phone_number}</td>
            <td>${order.address}</td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
            <td>${order.total_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td>${renderOrderStatus(order.status)}</td>
            <td class="actions-btn">
                ${userRole === '1' ? `
                    <a href="../order-detail/order-detail.html?id=${order.id}" class="edit-btn"><i class="fas fa-edit"></i></a>
                    <button class="cancel-btn" data-id="${order.id}" "><i class="fas fa-ban"></i></button>
                ` : ''}
                ${userRole === '2' ? `
                    <a href="../order-detail/order-detail.html?id=${order.id}" class="edit-btn"><i class="fas fa-eye"></i></a>
                    <button class="cancel-btn" data-id="${order.id}" "><i class="fas fa-ban"></i></button>
                ` : ''}
            </td>
        `;
            // Sự kiện click sẽ lọc
            document.querySelector(".statusHeader").addEventListener('click', () => {
                sortOrdersByStatus();
            });

            function sortOrdersByStatus() {
                const sortedOrders = orders.sort((a, b) => {
                    const statusOrder = {
                        'pending': 1,
                        'shipping': 2,
                        'completed': 3,
                        'canceled': 4
                    };

                    return statusOrder[a.status] - statusOrder[b.status];
                });
                
                renderOrderTable(sortedOrders);
            }

            orderTableBody.appendChild(tr);

            // Xử lý sự kiện khi nhấn nút "Xóa"
            const cancelBtn = tr.querySelector('.cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    const orderId = cancelBtn.getAttribute('data-id');
                    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
                        cancelOrder(orderId);
                    }
                });
            }
        });
    }

    function cancelOrder(orderId) {
        fetch(`http://localhost:3000/api/orders/cancel/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Hủy đơn hàng thành công');

                fetchOrders();
            } else {
                alert('Hủy đơn hàng thất bại vì đơn hàng đang giao hoặc đã được giao!');
            }
        })
        .catch(error => {
            console.error('Lỗi khi hủy đơn hàng:', error);
            alert('Đã xảy ra lỗi khi hủy đơn hàng');
        });
    }
    
    // Hàm xử lý trạng thái đơn hàng
    function renderOrderStatus(status) {
        switch (status.toLowerCase()) { // Chuyển đổi trạng thái về chữ thường
            case 'pending':
                return 'Chờ xử lý';
            case 'shipping':
                return 'Đang giao hàng';
            case 'completed':
                return 'Đã giao';
            case 'canceled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    }

    // Gọi hàm fetchOrders để lấy dữ liệu khi trang vừa load
    fetchOrders();
});
