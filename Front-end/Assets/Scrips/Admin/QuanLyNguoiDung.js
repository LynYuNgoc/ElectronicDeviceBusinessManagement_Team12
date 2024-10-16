// Hiển thị form thêm người dùng
function showAddUserForm() {
    document.getElementById('addUserForm').style.display = 'block';
}

// Đóng form thêm người dùng
function closeAddUserForm() {
    document.getElementById('addUserForm').style.display = 'none';
}

// Hàm để thêm người dùng mới
async function addUser() {
    const fullname = document.getElementById('newFullname').value;
    const email = document.getElementById('newEmail').value;
    const phone = document.getElementById('newPhone').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullname, email, phone, password: 'defaultpassword' }),
        });

        const data = await response.json();
        alert(data.message);
        closeAddUserForm();
        fetchUsers(); // Cập nhật danh sách người dùng
    } catch (error) {
        console.error('Lỗi khi thêm người dùng:', error);
    }
}

// Hàm để tìm kiếm người dùng
function searchUser() {
    const searchTerm = document.getElementById('searchUser').value.toLowerCase();
    const rows = document.querySelectorAll('#userTableBody tr');

    if (!searchTerm) {
        rows.forEach(row => {
            row.style.display = ''; // Hiện tất cả các hàng nếu không có từ khóa tìm kiếm
        });
        return;
    }

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            row.style.display = ''; // Hiện hàng
        } else {
            row.style.display = 'none'; // Ẩn hàng
        }
    });
}

// Gọi hàm để lấy danh sách người dùng khi trang được tải
document.addEventListener('DOMContentLoaded', fetchUsers);

// Hàm để lấy danh sách người dùng
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:5000/api/users'); // Địa chỉ đúng của API
        const users = await response.json(); // Chắc chắn rằng phản hồi là JSON

        // Cập nhật bảng người dùng
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = ''; // Xóa nội dung bảng hiện tại

        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.fullname}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.status ? 'Hoạt động' : 'Vô hiệu hóa'}</td>
                <td>
                    <button class="btn-edit" onclick="editUser('${user._id}')">Chỉnh sửa</button>
                    <button class="btn-delete" onclick="deleteUser('${user._id}')">Xóa</button>
                    <button class="btn-disable" onclick="disableUser('${user._id}')">Vô hiệu hóa</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
    }
}

// Hàm chỉnh sửa người dùng
function editUser(userId) {
    alert(`Chỉnh sửa người dùng với ID: ${userId}`);
    // Có thể mở form chỉnh sửa tại đây
}

// Hàm xóa người dùng
async function deleteUser(userId) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Lỗi ${response.status}: ${errorMessage}`);
            }

            const data = await response.json();
            alert(data.message);
            fetchUsers(); // Cập nhật danh sách người dùng sau khi xóa
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            alert('Xóa người dùng không thành công: ' + error.message);
        }
    }
}

// Hàm vô hiệu hóa người dùng
async function disableUser(userId) {
    if (confirm('Bạn có chắc chắn muốn vô hiệu hóa người dùng này không?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/disable/${userId}`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Lỗi ${response.status}: ${errorMessage}`);
            }

            const data = await response.json();
            alert(data.message);
            fetchUsers(); // Cập nhật danh sách người dùng sau khi vô hiệu hóa
        } catch (error) {
            console.error('Lỗi khi vô hiệu hóa người dùng:', error);
            alert('Vô hiệu hóa người dùng không thành công: ' + error.message);
        }
    }
}
