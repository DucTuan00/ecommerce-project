// Lấy token từ cookie
const token = document.cookie.split('; ').find(row => row.startsWith('token='));
const Token = token ? token.split('=')[1] : '';

// Lấy thông tin giỏ hàng từ server
async function fetchCart() {
    
    if (!Token) {
        console.error('Không tìm thấy token, vui lòng đăng nhập.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/cart`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            }
        });

        console.log('Response:', response);
        
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin giỏ hàng');
        }
        const cartData = await response.json();
        console.log('Cart Data:', cartData);

        return cartData;
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
    }
}

async function fetchProducts(productIds) {
    try {
        const response = await fetch(`http://localhost:3000/api/products?ids=${productIds.join(',')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin sản phẩm');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        return null;
    }
}

async function loadCartAndProducts() {
    const cartData = await fetchCart();
    
    // Lấy tất cả product_id từ cartData
    const productIds = cartData.map(item => item.product_id);

    if (productIds.length >= 0) {
        // Gọi fetchProducts với danh sách productIds
        const productData = await fetchProducts(productIds);
        renderCart(cartData, productData);
    } else {
        console.error('Giỏ hàng trống hoặc không có sản phẩm.');
    }
}

loadCartAndProducts();

// Hiển thị giỏ hàng
function renderCart(cartData, productData) {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';

    if (Array.isArray(cartData)) {
        cartData.forEach(item => {
            // Tìm sản phẩm trong mảng `productData` dựa trên `product_id`
            const product = productData.find(p => p.id === item.product_id);
            if (product) {
                console.log("Product quantity: " + product.quantity);
                const itemElement = createCartItemElement(item, product);
                cartItemsContainer.appendChild(itemElement);
            } else {
                console.warn(`Không tìm thấy sản phẩm với ID: ${item.product_id}`);
            }
        });

        // Tính toán tổng số tiền
        const total = cartData.reduce((acc, item) => acc + item.total_money, 0);
        updateCartTotal(total);

    } else {
        console.error('Dữ liệu giỏ hàng không hợp lệ.');
    }
}

// Tạo phần tử HTML cho mỗi sản phẩm trong giỏ hàng
function createCartItemElement(item, product) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');

    const productImage = document.createElement('img');
    productImage.src = `../../server-nodejs/${product.image}`; //Lấy đường dẫn ảnh

    itemElement.innerHTML = `
        <img src="${productImage.src}" alt="${product.name}" class="product-image">
        <div class="item-details">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatCurrency(item.total_money)}</p>
            <div class="quantity-controls">
                <span class="quantity">SL: ${item.quantity}</span>
            </div>
            <button class="remove-item" data-id="${item.id}">Xóa</button>
        </div>
    `;

    return itemElement;
}

// Cập nhật tổng giá trị giỏ hàng
function updateCartTotal(total) {
    const totalElement = document.querySelector('.cart-total');
    if (totalElement) {
        totalElement.textContent = formatCurrency(total); // Hoặc định dạng theo cách bạn muốn
    } else {
        console.error('Không tìm thấy phần tử tổng trong giao diện.');
    }
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Xử lý sự kiện xóa sản phẩm
async function removeItem(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            }
        });
        console.log(response);
        if (!response.ok) {
            throw new Error('Không thể xóa sản phẩm');
        } else {
            loadCartAndProducts(); //Cập nhật lại giỏ hàng
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
    }
}

// Thêm sự kiện cho các nút trong giỏ hàng
document.querySelector('.cart-items').addEventListener('click', (event) => {
    const target = event.target;
    const cartId = target.dataset.id;

    if (target.classList.contains('remove-item')) {
        removeItem(cartId);
    }
});

async function createOrder() {
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    if (!phone || !address) {
        alert('Vui lòng nhập đầy đủ số điện thoại và địa chỉ.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            },
            body: JSON.stringify({
                phone_number: phone,
                address: address
            })
        });
        if (!response.ok) {
            const errorData = await response.json(); // Giả sử API trả về JSON chứa thông tin lỗi, bao gồm product_id

            // Nếu có lỗi về số lượng trong kho, tiếp tục lấy thông tin sản phẩm bằng product_id
            if (errorData.message && errorData.message.includes('Not enough stock')) {
                const productId = errorData.message.match(/\d+/)[0]; // Lấy product_id từ message (dạng số)

                // Gọi API để lấy thông tin sản phẩm dựa trên product_id
                const productResponse = await fetch(`http://localhost:3000/api/products/${productId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`
                    }
                });

                if (productResponse.ok) {
                    const productData = await productResponse.json();
                    console.log(productData);
                    alert(`Bạn đã đặt quá số lượng trong kho của sản phẩm: ${productData.name}`);
                } else {
                    alert('Lỗi không thể lấy thông tin sản phẩm');
                }
            } else {
                alert('Lỗi không xác định. Không thể tạo đơn hàng.');
            }

            throw new Error('Không thể tạo đơn hàng');

        } else {
            alert('Đặt hàng thành công!');
            window.location.href = '/client/order/order.html';
        }
    } catch (error) {
        console.log('Lỗi khi tạo đơn hàng', error);
    }
}

document.querySelector('.create-order').addEventListener('click', (event) => {
    //Không cho thẻ <a> thực hiện chuyển hướng mặc định
    event.preventDefault();
    createOrder();
})

// Khởi tạo giỏ hàng khi trang được tải
document.addEventListener('DOMContentLoaded', fetchCart);