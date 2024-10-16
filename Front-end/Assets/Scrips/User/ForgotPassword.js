document.getElementById('forgotPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của biểu mẫu

    const email = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('A reset link has been sent to your email.'); // Hiển thị thông báo thành công
        } else {
            alert(result.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        alert('Có lỗi xảy ra: ' + error.message);
    }
});
