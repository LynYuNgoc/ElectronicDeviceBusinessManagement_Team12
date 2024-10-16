// Show the Add Product Form
function showAddItemForm() {
    document.getElementById('addProductForm').style.display = 'block';
}

// Close the Add Product Form
function closeAddItemForm() {
    document.getElementById('addProductForm').style.display = 'none';
}

// Add a new product and update the table
function addProduct() {
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = document.getElementById('productImage').files[0]; // Lấy hình ảnh đã chọn

    // Validate input fields
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
    newProduct.append('image', productImage); // Thêm hình ảnh vào FormData

    // Gửi yêu cầu POST tới API để thêm sản phẩm mới
    fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        body: newProduct // Gửi FormData
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
    })
    .catch(error => {
        console.error('Lỗi khi thêm sản phẩm:', error);
        alert('Có lỗi khi thêm sản phẩm.');
    });
}

// Khi trang được tải, gọi hàm này để lấy danh sách sản phẩm
window.onload = function () {
    fetchProducts();
};

// Lấy danh sách sản phẩm từ MongoDB
function fetchProducts() {
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            console.log('Danh sách sản phẩm:', data);
            data.forEach(product => {
                addProductToTable(product);  // Thêm từng sản phẩm vào bảng
            });
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

    cell1.innerHTML = product._id;  // Hiển thị ID sản phẩm từ MongoDB
    cell2.innerHTML = product.name;
    cell3.innerHTML = `$${product.price}`;
    cell4.innerHTML = product.category;
    cell5.innerHTML = `<img src="${product.imageURL}" alt="${product.name}" style="width: 50px; height: 50px;">`; // Hiển thị hình ảnh

    cell4.innerHTML += `<button onclick="deleteItem(this)">Xóa</button>`;
}

// Xóa sản phẩm
function deleteItem(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

// Reset các trường input sau khi thêm sản phẩm
function resetFormFields() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productImage').value = ''; // Reset hình ảnh
}

// Search for an item in the table
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
