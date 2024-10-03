const searchButton = document.querySelector('.search-bar button');
const searchInput = document.querySelector('.search-bar input');

// Khi nhấn vào nút kính lúp, hiển thị thanh tìm kiếm
searchButton.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của nút
    searchInput.style.width = '300px';
    searchInput.style.opacity = '1';
    searchInput.focus(); // Đưa con trỏ chuột vào ô nhập liệu
});

// Hiển thị bảng popup khi di chuột qua
function showPopup(category) {
    var popup = document.getElementById(category);
    if (popup) {
        popup.style.display = 'block';
    }
}

// Ẩn bảng popup khi rời chuột khỏi danh mục
function hidePopup(category) {
    var popup = document.getElementById(category);
    if (popup) {
        popup.style.display = 'none';
    }
}
