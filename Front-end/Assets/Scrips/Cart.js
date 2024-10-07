// Tính tổng giá trị của giỏ hàng
function updateCartTotal() {
    const cartItems = document.querySelectorAll("#cart-items tr");
    let total = 0;

    cartItems.forEach((item) => {
        const priceElement = item.querySelector("td:nth-child(2)").innerText.replace('$', '');
        const quantityElement = item.querySelector(".quantity-input").value;
        const totalElement = item.querySelector("td:nth-child(4)");

        const price = parseFloat(priceElement);
        const quantity = parseInt(quantityElement);

        const itemTotal = price * quantity;
        totalElement.innerText = `$${itemTotal.toFixed(2)}`;

        total += itemTotal;
    });

    document.getElementById("total-price").innerText = `$${total.toFixed(2)}`;
}

// Xóa sản phẩm khỏi giỏ hàng
document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
        const row = event.target.closest("tr");
        row.remove();
        updateCartTotal();
    });
});

// Cập nhật khi số lượng thay đổi
document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", () => {
        updateCartTotal();
    });
});

// Cập nhật tổng khi trang tải lần đầu
updateCartTotal();
