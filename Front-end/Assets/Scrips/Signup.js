function validateForm() {
    let isValid = true;

    // Lấy giá trị của các trường nhập liệu
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value; // Thêm biến địa chỉ

    // Lấy các phần tử thông báo lỗi
    const phoneError = document.getElementById('phone-error');
    const passwordError = document.getElementById('password-error');

    // Kiểm tra số điện thoại phải có đúng 10 chữ số
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        phoneError.textContent = 'Phone number must be exactly 10 digits.';
        phoneError.style.display = 'block';
        isValid = false;
    } else {
        phoneError.style.display = 'none';
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu phải khớp nhau
    if (password !== confirmPassword) {
        passwordError.textContent = 'Passwords do not match.';
        passwordError.style.display = 'block';
        isValid = false;
    } else {
        passwordError.style.display = 'none';
    }

    // Nếu form hợp lệ, gửi yêu cầu POST đến server
    if (isValid) {
        registerUser({ fullname, email, phone, password, address });
    }

    return false; // Ngăn chặn form gửi lại (sẽ gửi qua fetch)
}

async function registerUser(userData) {
    try {
        const response = await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message); // Hiển thị thông báo thành công
        } else {
            alert(result.message || 'Registration failed');
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}
