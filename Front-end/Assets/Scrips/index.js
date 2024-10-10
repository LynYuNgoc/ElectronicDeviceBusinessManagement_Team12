const searchButton = document.querySelector('.search-bar button');
const searchInput = document.querySelector('.search-bar input');

// Khi nhấn vào nút kính lúp, hiển thị thanh tìm kiếm
searchButton.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của nút
    showSearchInput();
});

// Hiển thị thanh tìm kiếm
function showSearchInput() {
    searchInput.style.width = '300px';
    searchInput.style.opacity = '1';
    searchInput.focus(); // Đưa con trỏ chuột vào ô nhập liệu
}

// Hiển thị bảng popup khi di chuột qua
function showPopup(category) {
    const popup = document.getElementById(category);
    if (popup) {
        popup.style.display = 'block';
    }
}

// Ẩn bảng popup khi rời chuột khỏi danh mục
function hidePopup(category) {
    const popup = document.getElementById(category);
    if (popup) {
        popup.style.display = 'none';
    }
}

const carouselImages = document.querySelector('.carousel-images');
const images = document.querySelectorAll('.carousel-images img');
let currentIndex = 0;

function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length; // Tăng chỉ số, quay lại nếu tới cuối
    const offset = -currentIndex * 100; // Tính toán độ dịch chuyển
}

// Thay đổi hình ảnh mỗi 3 giây
setInterval(showNextImage, 3000);
document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');

    // Xử lý sự kiện khi form đăng nhập được gửi
    if (signinForm) {
        signinForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Ngăn chặn hành động mặc định của biểu mẫu

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5000/api/users/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();
                handleSignInResponse(response, result);
            } catch (error) {
                alert(`Có lỗi xảy ra: ${error.message}`);
            }
        });
    }
});

function handleSignInResponse(response, result) {
    if (response.ok) {
        alert(result.message); // Hiển thị thông báo thành công

        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('isLoggedIn', 'true'); // Đánh dấu người dùng đã đăng nhập
        localStorage.setItem('username', result.user.username); // Giả sử thông tin người dùng được trả về từ server

        // Chuyển hướng đến trang chính hoặc trang khác
        window.location.href = "index.html"; // Thay đổi đường dẫn theo trang của bạn
    } else {
        alert(result.message || 'Đăng nhập thất bại');
    }
}

window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
        const username = localStorage.getItem('username');
        document.getElementById('username').textContent = username;
        document.getElementById('userContainer').style.display = 'block'; // Hiển thị tên người dùng
        
        // Ẩn các liên kết đăng nhập
        const authLinks = document.getElementById('authLinks');
        if (authLinks) {
            authLinks.style.display = 'none'; // Ẩn liên kết đăng nhập
        }

        // Hiển thị menu khi bấm vào tên người dùng
        document.getElementById('username').addEventListener('click', function() {
            const avatarMenu = document.getElementById('avatarMenu');
            avatarMenu.style.display = avatarMenu.style.display === 'block' ? 'none' : 'block';
        });
    }
};

// Xử lý chức năng đăng xuất
document.getElementById('logout')?.addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html'; // Chuyển về trang chủ sau khi đăng xuất
});


// Xử lý sự kiện cho nút đăng nhập nếu cần
document.getElementById('loginButton')?.addEventListener('click', function() {
    window.location.href = 'signin.html'; // Điều hướng sang trang đăng nhập
});
