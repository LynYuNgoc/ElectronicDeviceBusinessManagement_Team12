// Giỏ hàng (có thể lưu vào localStorage để giữ cho giỏ hàng tồn tại giữa các phiên làm việc)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.name === product.name && item.color === product.color);
    
    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Nếu chưa, thêm sản phẩm mới vào giỏ hàng
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Sản phẩm đã được thêm vào giỏ hàng!'); // Thông báo cho người dùng

    // Kiểm tra và hiển thị giỏ hàng
    console.log(cart); // In giỏ hàng ra console để kiểm tra
}

// Lắng nghe sự kiện khi nhấn nút "Add to Cart"
document.addEventListener('DOMContentLoaded', () => {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productName = addToCartBtn.getAttribute('data-name');
            const productPrice = parseFloat(addToCartBtn.getAttribute('data-price'));
            const quantity = document.getElementById('quantity').value; // Lấy số lượng từ input
            const selectedColor = document.getElementById('color').value; // Lấy màu đã chọn
            
            // Tạo đối tượng sản phẩm
            const product = {
                name: productName,
                price: productPrice,
                quantity: parseInt(quantity),
                color: selectedColor // Thêm thông tin màu
            };

            // Gọi hàm thêm sản phẩm vào giỏ hàng
            addToCart(product);
        });
    } else {
        console.error("Nút 'Add to Cart' không được tìm thấy!");
    }
});
