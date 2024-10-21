// Hàm để lấy thông tin người dùng từ API
async function fetchUserProfile() {
    const userEmail = localStorage.getItem('userEmail'); // Giả sử email được lưu trong localStorage khi đăng nhập
    if (!userEmail) {
        console.error('No email found');
        return;
    }

    try {
        // Gọi API để lấy thông tin người dùng
        const response = await fetch(`/api/user/${userEmail}`);
        const userData = await response.json();

        if (response.ok) {
            // Cập nhật giao diện với thông tin người dùng
            document.getElementById('fullname').querySelector('span').innerText = userData.fullname;
            document.getElementById('username').querySelector('span').innerText = userData.username;
            document.getElementById('email').querySelector('span').innerText = userData.email;
            document.getElementById('phone').querySelector('span').innerText = userData.phone;
            document.getElementById('address').querySelector('span').innerText = userData.address;
            document.getElementById('userAvatar').src = userData.avatarUrl || 'path/to/default/avatar.jpg';
        } else {
            console.error('Failed to fetch user profile', userData.message);
        }
    } catch (error) {
        console.error('Error fetching user data', error);
    }
}

// Gọi hàm khi trang được tải
document.addEventListener('DOMContentLoaded', fetchUserProfile);
