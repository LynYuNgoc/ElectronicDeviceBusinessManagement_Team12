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


// Xử lý sự kiện khi form đăng nhập được gửi
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    const signinForm = document.getElementById('signinForm');
    
    // Kiểm tra nếu tìm thấy phần tử searchButton
    if (searchButton && searchInput) {
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
    }

    // Kiểm tra nếu tìm thấy phần tử signinForm
    if (signinForm) {
        // Xử lý sự kiện khi form đăng nhập được gửi
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
  

    // Ẩn các link đăng nhập/đăng ký
    function hideAuthLinks() {
        document.querySelector('.auth-links .signup').style.display = 'none';
        document.querySelector('.auth-links .signin').style.display = 'none';
    }
});
