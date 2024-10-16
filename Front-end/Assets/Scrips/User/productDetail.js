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

// Lắng nghe sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    // Lấy query parameters từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');
    const productPrice = urlParams.get('price');
    const productImage = urlParams.get('image');

    // Cập nhật thông tin sản phẩm trên trang
    if (productName) {
        document.querySelector('.product-info h2').innerText = productName;
    }
    
    if (productPrice) {
        document.querySelector('.product-price').innerText = `$${productPrice}`;
    }

    if (productImage) {
        // Cập nhật hình ảnh sản phẩm
        const imageHolder = document.querySelector('.product-images');
        const imgElement = document.createElement('img');
        imgElement.src = `../../uploads/${productImage}`; // Đường dẫn tới hình ảnh
        imgElement.alt = productName;
        imgElement.style.width = '100%'; // Điều chỉnh kích thước hình ảnh nếu cần
        imgElement.style.borderRadius = '8px'; // Bo góc hình ảnh nếu cần
        imageHolder.innerHTML = ''; // Xóa nội dung cũ (nếu có)
        imageHolder.appendChild(imgElement); // Thêm hình ảnh vào phần tử
    }

    // Lắng nghe sự kiện khi nhấn nút "Add to Cart"
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = document.getElementById('quantity').value; // Lấy số lượng từ input
            const selectedColor = document.getElementById('color').value; // Lấy màu đã chọn
            
            // Tạo đối tượng sản phẩm
            const product = {
                name: productName,
                price: parseFloat(productPrice),
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
