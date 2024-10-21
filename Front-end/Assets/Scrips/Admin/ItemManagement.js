// Giữ lại danh sách sản phẩm
let products = [];

// Hiển thị Form Thêm Sản Phẩm
function showAddItemForm() {
    document.getElementById('addProductForm').style.display = 'block';
}

// Đóng Form Thêm Sản Phẩm
function closeAddItemForm() {
    document.getElementById('addProductForm').style.display = 'none';
}

// Thêm sản phẩm mới và cập nhật bảng
// Thêm sản phẩm mới và cập nhật bảng
function addProduct() {
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = document.getElementById('productImage').files[0];

    // Kiểm tra các trường nhập
    if (!productName || !productPrice || !productCategory || !productImage) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }

    // Tạo đối tượng FormData để gửi dữ liệu bao gồm hình ảnh
    const newProduct = new FormData();
    newProduct.append('name', productName);
    newProduct.append('price', parseFloat(productPrice));
    newProduct.append('description', productDescription);
    newProduct.append('category', productCategory);
    newProduct.append('image', productImage);

    // Gửi yêu cầu POST tới API để thêm sản phẩm mới
    fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        body: newProduct
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sản phẩm đã được lưu:', data);
        alert('Sản phẩm đã thêm thành công!');

        // Thêm sản phẩm mới vào bảng mà không cần tải lại trang
        addProductToTable(data);

        // Đóng form sau khi thêm sản phẩm
        closeAddItemForm();

        // Xóa các giá trị trong form sau khi thêm
        resetFormFields();

        // Lưu sản phẩm vào localStorage
        localStorage.setItem('lastAddedProduct', JSON.stringify(data));
    })
    .catch(error => {
        console.error('Lỗi khi thêm sản phẩm:', error);
        alert('Có lỗi khi thêm sản phẩm.');
    });
}
//
function displayProductDetail() {
    const lastAddedProduct = localStorage.getItem('lastAddedProduct');
    if (lastAddedProduct) {
        const product = JSON.parse(lastAddedProduct);
        document.querySelector('.productName').textContent = product.name;
        document.querySelector('.productPrice').textContent = `$${product.price}`;
        document.querySelector('.productDescription').textContent = product.description;

        const imageHolder = document.querySelector('.productImage .image-placeholder');
        const imgElement = document.createElement('img');
        imgElement.src = `../../uploads/${product.image}`; // Đảm bảo đường dẫn hình ảnh là đúng
        imgElement.alt = product.name;
        imgElement.style.width = '100%';
        imageHolder.innerHTML = '';
        imageHolder.appendChild(imgElement);
    }
}


// Khi trang được tải, gọi hàm này để lấy danh sách sản phẩm
window.onload = function () {
    fetchProducts();
};

// Lấy danh sách sản phẩm từ MongoDB
function fetchProducts() {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '<tr><td colspan="5">Đang tải...</td></tr>'; // Loading

    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = ''; // Xóa dòng "Đang tải"
            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">Không có sản phẩm nào.</td></tr>';
            } else {
                data.forEach(product => {
                    addProductToTable(product);  // Thêm từng sản phẩm vào bảng
                });
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        });
}

// Thêm sản phẩm mới vào bảng
function addProductToTable(product) {
    const table = document.getElementById('productTableBody');
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);

    cell1.innerHTML = product._id;  
    cell2.innerHTML = `<a href="../Pages/ProductDetail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${product.imageURL}&description=${encodeURIComponent(product.description)}">${product.name}</a>`;
    cell3.innerHTML = `$${product.price}`;
    cell4.innerHTML = product.category;
    cell5.innerHTML = `<img src="${product.imageURL}" alt="${product.name}" style="width: 50px; height: 50px;">`;

    // Thêm nút xóa với xác nhận
    cell6.innerHTML = `<button onclick="confirmDeleteItem(this, '${product._id}')">Xóa</button>`;
}


// Xác nhận trước khi xóa sản phẩm
function confirmDeleteItem(btn, productId) {
    const confirmation = confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
    if (confirmation) {
        deleteItem(btn, productId);
    }
}

// Xóa sản phẩm
function deleteItem(btn, productId) {
    const row = btn.parentNode.parentNode;

    fetch(`http://localhost:5000/api/products/delete/${productId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Sản phẩm đã xóa:', data);
        row.parentNode.removeChild(row); // Xóa hàng khỏi bảng sau khi xóa thành công trong DB
        alert('Sản phẩm đã được xóa!');
    })
    .catch(error => {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Có lỗi khi xóa sản phẩm.');
    });
    
}

// Reset các trường input sau khi thêm sản phẩm
function resetFormFields() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productImage').value = ''; // Reset hình ảnh
}

// Tìm kiếm sản phẩm
function searchItem() {
    const searchValue = document.getElementById('searchItem').value.toLowerCase();
    const table = document.getElementById('productTableBody');
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const itemName = rows[i].getElementsByTagName('td')[1].innerText.toLowerCase();
        if (itemName.includes(searchValue)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}
