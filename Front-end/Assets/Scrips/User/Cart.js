// Tạo giỏ hàng hoặc lấy giỏ hàng đã có từ localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Hiển thị các sản phẩm trong giỏ hàng
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');

// Hàm hiển thị giỏ hàng
function displayCart() {
    // Xóa nội dung cũ trước khi hiển thị mới
    cartItemsContainer.innerHTML = ''; // Xóa nội dung hiện tại

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5">Giỏ hàng của bạn đang trống.</td></tr>';
        totalPriceElement.textContent = '$0.00'; // Đặt tổng giá là 0
    } else {
        let totalPrice = 0; // Biến để tính tổng giá tiền

        // Hiển thị từng sản phẩm trong giỏ hàng
        cart.forEach((product, index) => {
            const productRow = document.createElement('tr');

            // Tính tổng giá cho sản phẩm
            const productTotal = product.price * product.quantity;
            totalPrice += productTotal;

            productRow.innerHTML = `
                <td>
                    <img src="product1.jpg" alt="${product.name}" class="cart-img"> <!-- Thay đổi đường dẫn ảnh sản phẩm -->
                    <span>${product.name}</span>
                </td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <input type="number" value="${product.quantity}" class="quantity-input" min="1" onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>$${productTotal.toFixed(2)}</td>
                <td><button class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button></td>
            `;
            cartItemsContainer.appendChild(productRow);
        });

        // Cập nhật tổng giá
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Hàm cập nhật số lượng sản phẩm
function updateQuantity(index, quantity) {
    if (index >= 0 && index < cart.length && quantity > 0) {
        cart[index].quantity = parseInt(quantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart(); // Cập nhật giỏ hàng mà không tải lại trang
    }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        // Xóa sản phẩm theo chỉ số
        cart.splice(index, 1); // Xóa sản phẩm tại chỉ số tương ứng
        
        // Lưu giỏ hàng đã cập nhật vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Cập nhật giỏ hàng mà không tải lại trang
        displayCart();
    }
}

// Hiển thị giỏ hàng lần đầu
displayCart();
