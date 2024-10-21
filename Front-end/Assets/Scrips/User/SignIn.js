document.getElementById('signinForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của biểu mẫu

    // Lấy giá trị từ các trường nhập liệu
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
        if (response.ok) {
            alert(result.message); // Hiển thị thông báo thành công

            // Lưu thông tin người dùng vào localStorage
            const user = result.user; // Giả sử kết quả trả về có thông tin người dùng
            localStorage.setItem('user', JSON.stringify(user));

            // Chuyển hướng đến trang chính hoặc trang khác
            window.location.href = "index.html"; // Thay đổi đường dẫn theo trang của bạn
        } else {
            alert(result.message || 'Đăng nhập thất bại');
        }
    } catch (error) {
        alert('Có lỗi xảy ra: ' + error.message);
    }
});