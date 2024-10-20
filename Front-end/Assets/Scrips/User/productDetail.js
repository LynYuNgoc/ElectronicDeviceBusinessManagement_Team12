// Khởi tạo giỏ hàng từ localStorage hoặc mảng rỗng nếu không có
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Thêm sản phẩm mới vào giỏ
        cart.push(product);
    }

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
    console.log(cart);
}

// Hàm hiển thị sản phẩm chi tiết
function displayProductDetail() {
    // Lấy dữ liệu sản phẩm từ URL hoặc localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let productName = urlParams.get('name');
    let productPrice = urlParams.get('price');
    let productDescription = urlParams.get('description');
    let productImage = urlParams.get('image');

    // Nếu không có dữ liệu từ URL, lấy sản phẩm từ localStorage (nếu có)
    if (!productName || !productPrice || !productImage) {
        const lastAddedProduct = localStorage.getItem('lastAddedProduct');
        if (lastAddedProduct) {
            const product = JSON.parse(lastAddedProduct);
            productName = product.name;
            productPrice = product.price;
            productDescription = product.description;
            productImage = product.image;
        }
    }

    // Hiển thị thông tin sản phẩm trên trang
    if (productName) {
        document.querySelector('.productName').textContent = productName;
    }

    if (productPrice) {
        document.querySelector('.productPrice').textContent = `$${productPrice}`;
    }

    if (productDescription) {
        document.querySelector('.productDescription').textContent = productDescription;
    }

    if (productImage) {
        const imageHolder = document.querySelector('.productImage .image-placeholder');
        const imgElement = document.createElement('img');
        imgElement.src = `../../uploads/${productImage}`;
        imgElement.alt = productName;
        imgElement.style.width = '100%';
        imageHolder.innerHTML = ''; // Xóa placeholder
        imageHolder.appendChild(imgElement); // Thêm hình ảnh mới
    }
}

// Lắng nghe sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    displayProductDetail();

    // Xử lý sự kiện khi nhấn nút "Add to Cart"
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productName = document.querySelector('.productName').innerText;
            const productPrice = parseFloat(document.querySelector('.productPrice').innerText.replace('$', ''));
            const productDescription = document.querySelector('.productDescription').innerText;
            const productImage = document.getElementById('productImage').src;

            const product = {
                name: productName,
                price: productPrice,
                description: productDescription,
                image: productImage
            };
            addToCart(product);
        });
    }
});
