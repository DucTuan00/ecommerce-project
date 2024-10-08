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

    if (productIds.length > 0) {
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

// Khởi tạo giỏ hàng khi trang được tải
document.addEventListener('DOMContentLoaded', fetchCart);