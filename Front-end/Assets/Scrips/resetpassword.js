document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn không cho form tải lại trang

    const password = document.getElementById('password').value;
    const token = window.location.pathname.split('/').pop(); // Lấy token từ URL

    try {
        const response = await fetch(`http://localhost:5000/api/users/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Mật khẩu đã được đặt lại thành công!'); // Hiển thị thông báo thành công
            window.location.href = '/signin.html'; // Chuyển hướng về trang đăng nhập
        } else {
            alert(result.message || 'Có lỗi xảy ra.');
        }
    } catch (error) {
        alert('Có lỗi xảy ra: ' + error.message);
    }
});
