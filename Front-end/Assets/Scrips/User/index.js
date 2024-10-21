// Khai báo các biến cần thiết
const searchButton = document.querySelector('.search-bar button');
const searchInput = document.querySelector('.search-bar input');
const signinForm = document.getElementById('signinForm');
const productGrid = document.getElementById('productGrid');
const profileDropdownList = document.querySelector(".profile-dropdown-list");
const btn = document.querySelector(".profile-dropdown-btn");
const avatarMenu = document.getElementById('avatarMenu');

// ---------------------------------------------------------------------
// Slider - Quản lý việc chuyển đổi hình ảnh trong slider
const rightBtn = document.querySelector('.fa-circle-chevron-right');
const leftBtn = document.querySelector('.fa-circle-chevron-left');
const images = document.querySelectorAll('.Slider-content-left-top img');
let currentIndex = 0; // Vị trí ảnh hiện tại
const intervalTime = 3000; // Thời gian tự động chuyển ảnh (3 giây)
let autoMove; // Biến lưu trữ interval

// Hàm hiển thị ảnh dựa trên chỉ số
function showImage(index) {
    images.forEach((img, i) => {
        img.style.display = (i === index) ? 'block' : 'none'; // Chỉ hiển thị ảnh hiện tại
    });
}

// Ban đầu hiển thị ảnh đầu tiên
showImage(currentIndex);

// Chuyển đến ảnh tiếp theo
function moveToNextImage() {
    currentIndex = (currentIndex + 1) % images.length; // Tăng chỉ số, quay về 0 nếu hết ảnh
    showImage(currentIndex);
}

// Chuyển đến ảnh trước đó
function moveToPreviousImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Giảm chỉ số, quay về ảnh cuối nếu âm
}

// Xử lý sự kiện nhấn vào các nút chuyển ảnh
rightBtn.addEventListener('click', moveToNextImage);
leftBtn.addEventListener('click', moveToPreviousImage);

// Khởi động tự động chuyển ảnh
function startAutoMove() {
    autoMove = setInterval(moveToNextImage, intervalTime);
}

// Dừng tự động chuyển ảnh
function stopAutoMove() {
    clearInterval(autoMove);
}

// Khởi động chuyển ảnh tự động khi trang được tải
startAutoMove();

// Dừng auto move khi di chuột vào slider
document.querySelector('.Slider-content-left-top').addEventListener('mouseover', stopAutoMove);

// Khởi động lại auto move khi chuột rời khỏi slider
document.querySelector('.Slider-content-left-top').addEventListener('mouseleave', startAutoMove);

const imgNumberLi = document.querySelectorAll('.Slider-content-left-bottom li');
imgNumberLi.forEach(function(image, index) {
    image.addEventListener("click", function() {
        document.querySelector('.Slider-content-left-top').style.right = index * 100 + "%";
    });
});
// ---------------------------------------------------------------------
// Tìm kiếm - Hiển thị thanh tìm kiếm khi người dùng nhấn vào biểu tượng kính lúp

searchButton.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của nút
    showSearchInput();
});

function showSearchInput() {
    searchInput.style.width = '300px';
    searchInput.style.opacity = '1';
    searchInput.focus(); // Đưa con trỏ chuột vào ô nhập liệu
}

// ---------------------------------------------------------------------
// Đăng nhập - Xử lý form đăng nhập và lưu trạng thái đăng nhập
async function handleSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        console.log('Kết quả nhận được từ API:', result);

        if (response.ok) {
            // Lưu tất cả thông tin cần thiết vào localStorage
            localStorage.setItem('userEmail', email); // Lưu email vào localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', result.user.id);
            localStorage.setItem('fullname', result.user.fullname);
            localStorage.setItem('email', result.user.email);
            localStorage.setItem('phone', result.user.phone);
            localStorage.setItem('address', result.user.address);
            
            // Cập nhật tên người dùng
            updateUsernameDisplay();
            window.location.href = "index.html"; // Chuyển hướng về trang chính
        } else {
            alert(result.message || 'Đăng nhập thất bại');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert(`Có lỗi xảy ra: ${error.message}`);
    }
}


// Đăng xuất
document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token'); // Xóa token
    localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
    window.location.reload(); // Tải lại trang
});

// ---------------------------------------------------------------------
// Lấy danh sách sản phẩm từ API và hiển thị chúng trong lưới sản phẩm

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

// ---------------------------------------------------------------------
// Xử lý trạng thái đăng nhập khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const signupLink = document.querySelector('.signup');
    const signinLink = document.querySelector('.signin');
    const userContainer = document.getElementById('userContainer');
    
    // Kiểm tra trạng thái đăng nhập
    if (isLoggedIn === 'true') {
        if (signupLink) signupLink.style.display = 'none';
        if (signinLink) signinLink.style.display = 'none';
        if (userContainer) userContainer.style.display = 'block';
        
        // Chỉ gọi hàm fetchUserData nếu userId tồn tại trong localStorage
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchUserData(); 
        } else {
            console.log('Không có userId để gọi API');
        }

    } else {
        if (signupLink) signupLink.style.display = 'inline-block';
        if (signinLink) signinLink.style.display = 'inline-block';
        if (userContainer) userContainer.style.display = 'none';
        
    }

    // Gán sự kiện cho form đăng nhập
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }

    // Xử lý sự kiện mở/đóng dropdown
    const toggleDropdown = () => {
        avatarMenu.style.display = avatarMenu.style.display === 'block' ? 'none' : 'block';
    };

    btn.addEventListener('click', toggleDropdown);

    // Đóng menu dropdown khi nhấn ra ngoài
    window.addEventListener("click", function(e) {
        if (!btn.contains(e.target) && !avatarMenu.contains(e.target)) {
            avatarMenu.style.display = 'none';
        }
    });

    fetchProducts(); // Gọi hàm lấy danh sách sản phẩm
});

// ---------------------------------------------------------------------
// Hiển thị danh sách sản phẩm dựa trên danh mục được chọn

const categories = {
    phones: ['iPhone', 'Samsung', 'Xiaomi', 'Sony', 'Huawei', 'Poco', 'Vsmart', 'hoco', 'blackberry', 'oneplus'],
    laptops: ['MacBook Pro', 'Dell XPS 13', 'HP Spectre x360'],
    watches: ['Apple Watch Series 7', 'Samsung Galaxy Watch 4'],
    tablets: ['iPad Pro', 'Samsung Galaxy Tab S7'],
    headphones: ['Sony WH-1000XM4', 'Bose 700'],
    more: ['Extra Product 1', 'Extra Product 2']
};

// Hiển thị sản phẩm theo danh mục
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

// Xử lý sự kiện khi nhấn vào các danh mục trong sidebar
document.querySelectorAll('.product-sidebar li').forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        displayProducts(category); // Hiển thị sản phẩm theo danh mục
    });
});
