// Khai báo các biến cần thiết
const searchButton = document.querySelector('.search-bar button');
const searchInput = document.querySelector('.search-bar input');
const signinForm = document.getElementById('signinForm');
const productGrid = document.getElementById('productGrid');
const profileDropdownList = document.querySelector(".profile-dropdown-list");
const btn = document.querySelector(".profile-dropdown-btn");
const avatarMenu = document.getElementById('avatarMenu');

//slider--------------------------------------------------------------------
//slider--------------------------------------------------------------------
const rightbtn = document.querySelector('.fa-circle-chevron-right');
const leftbtn = document.querySelector('.fa-circle-chevron-left');
const imgNumbers = document.querySelectorAll('.Slider-content-left-top img'); // Lấy tất cả hình ảnh
let index = 0;

rightbtn.addEventListener("click", function() {
    index = index + 1;
    if (index >= imgNumbers.length) { // Nếu chỉ số lớn hơn số lượng hình ảnh, reset lại
        index = 0;
    }
    document.querySelector(".Slider-content-left-top").style.transform = "translateX(-" + index * 100 + "%)";
});

leftbtn.addEventListener("click", function() {
    index = index - 1;
    if (index < 0) { // Nếu chỉ số nhỏ hơn 0, quay lại hình ảnh cuối cùng
        index = imgNumbers.length - 1;
    }
    document.querySelector(".Slider-content-left-top").style.transform = "translateX(-" + index * 100 + "%)";
});


// Hàm hiển thị thanh tìm kiếm
function showSearchInput() {
    searchInput.style.width = '300px';
    searchInput.style.opacity = '1';
    searchInput.focus(); // Đưa con trỏ chuột vào ô nhập liệu
}

// Hàm xử lý sự kiện khi form đăng nhập được gửi
async function handleSignIn(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của biểu mẫu
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        handleSignInResponse(response, result);
    } catch (error) {
        alert(`Có lỗi xảy ra: ${error.message}`);
    }
}

// Hàm xử lý phản hồi khi đăng nhập thành công
function handleSignInResponse(response, result) {
    const userContainer = document.getElementById('userContainer');
    const signupLink = document.querySelector('.signup');
    const signinLink = document.querySelector('.signin');
    const cartLink = document.querySelector('.auth-links a[href*="Cart.html"]');

    if (response.ok) {
        alert(result.message); // Hiển thị thông báo thành công
        localStorage.setItem('isLoggedIn', 'true'); // Lưu trạng thái đăng nhập

        // Ẩn Sign Up và Sign In links
        if (signupLink) signupLink.style.display = 'none';
        if (signinLink) signinLink.style.display = 'none';

        // Hiển thị userContainer
        if (userContainer) userContainer.style.display = 'block';

        // Giữ giỏ hàng hiển thị
        if (cartLink) cartLink.style.display = 'inline-block';

        // Chuyển hướng về trang chính
        window.location.href = "index.html";
    } else {
        alert(result.message || 'Đăng nhập thất bại');
    }
}

// Hàm lấy danh sách sản phẩm
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Lỗi khi lấy sản phẩm');

        const products = await response.json();
        if (!Array.isArray(products) || products.length === 0) {
            return; // Thoát hàm nếu không có sản phẩm
        }

        productGrid.innerHTML = ''; // Xóa nội dung hiện tại

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <a href="../../Pages/User/ProductDetail.html">
                    <img src="/uploads/${product.image}" alt="${product.name}">
                    <h4>${product.name}</h4>
                    <p class="new-price">$${product.price}</p>
                    <button class="buy-btn">Mua Ngay</button>
                </a>
            `;
            productGrid.appendChild(productItem);
        });
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// Sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const signupLink = document.querySelector('.signup');
    const signinLink = document.querySelector('.signin');
    const userContainer = document.getElementById('userContainer');
    const cartLink = document.querySelector('.auth-links a[href*="Cart.html"]');

    // Kiểm tra trạng thái đăng nhập
    if (isLoggedIn === 'true') {
        if (signupLink) signupLink.style.display = 'none';
        if (signinLink) signinLink.style.display = 'none';
        if (userContainer) userContainer.style.display = 'block';
    } else {
        if (signupLink) signupLink.style.display = 'inline-block';
        if (signinLink) signinLink.style.display = 'inline-block';
        if (userContainer) userContainer.style.display = 'none';
    }

    // Gán sự kiện cho form đăng nhập
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }

    // Đăng xuất
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');  // Xóa trạng thái đăng nhập
        window.location.reload(); // Tải lại trang sau khi đăng xuất
    });

    // Xử lý sự kiện mở/đóng dropdown
    const toggleDropdown = () => {
        avatarMenu.style.display = avatarMenu.style.display === 'block' ? 'none' : 'block';
    };

    btn.addEventListener('click', toggleDropdown);

    // Đóng menu dropdown khi nhấn ra ngoài
    window.addEventListener("click", function (e) {
        if (!btn.contains(e.target) && !avatarMenu.contains(e.target)) {
            avatarMenu.style.display = 'none';
        }
    });

    fetchProducts(); // Gọi hàm lấy danh sách sản phẩm
});

// Sự kiện khi nhấn vào nút kính lúp, hiển thị thanh tìm kiếm
searchButton.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của nút
    showSearchInput();
});
const categories = {
    phones: ['iPhone', 'Samsung', 'Xiaomi' , 'Sony' ,'Huawei' , 'Poco' , 'Vsmart' , 'hoco' , 'blackberry' , 'oneplus'],
    laptops: ['MacBook Pro', 'Dell XPS 13', 'HP Spectre x360'],
    watches: ['Apple Watch Series 7', 'Samsung Galaxy Watch 4'],
    tablets: ['iPad Pro', 'Samsung Galaxy Tab S7'],
    headphones: ['Sony WH-1000XM4', 'Bose 700'],
    more: ['Extra Product 1', 'Extra Product 2']
};

// Ví dụ cách hiển thị danh sách sản phẩm
function displayProducts(category) {
    const productCatalogue = document.getElementById('productTable');
    productCatalogue.innerHTML = ''; // Xóa nội dung cũ

    categories[category].forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `<h5>${product}</h5>`;
        productCatalogue.appendChild(productItem);
    });
}

document.querySelectorAll('.product-sidebar li').forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        const isExpanded = item.getAttribute('data-expanded') === 'true';

        // Đóng tất cả các danh mục
        document.querySelectorAll('.product-sidebar li').forEach(li => {
            li.setAttribute('data-expanded', 'false'); // Đặt trạng thái thành đóng
            li.classList.remove('active'); // Bỏ lớp active nếu có
        });

        // Nếu danh mục không được mở, mở nó
        if (!isExpanded) {
            item.setAttribute('data-expanded', 'true'); // Đặt trạng thái thành mở
            item.classList.add('active'); // Thêm lớp active để thay đổi kiểu dáng
            displayProducts(category); // Hiển thị sản phẩm theo danh mục
        } else {
            // Nếu danh mục đã mở, đóng nó
            item.setAttribute('data-expanded', 'false');
            item.classList.remove('active'); // Bỏ lớp active
            const productCatalogue = document.getElementById('productTable');
            productCatalogue.innerHTML = ''; // Xóa danh sách sản phẩm
        }
    });
});

