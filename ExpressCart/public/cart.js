document.addEventListener("DOMContentLoaded", function () {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    let cart = [];
    let total = 0;

    // Function to update the cart display
    function updateCart() {
        cartItems.innerHTML = "";
        total = 0;

        cart.forEach((item) => {
            const cartItem = document.createElement("li");
            cartItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            cartItems.appendChild(cartItem);
            total += item.price;
        });

        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Event listener to add items to the cart
    document.getElementById("post-item-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const itemName = document.getElementById("item-name").value;
        const itemPrice = parseFloat(document.getElementById("item-price").value);

        if (itemName && !isNaN(itemPrice) && itemPrice > 0) {
            cart.push({ name: itemName, price: itemPrice });
            updateCart();
        }

        document.getElementById("item-name").value = "";
        document.getElementById("item-price").value = "";
    });

    // Event listener for removing items from the cart (if you want this functionality)
    cartItems.addEventListener("click", function (e) {
        if (e.target && e.target.nodeName === "LI") {
            const index = Array.from(cartItems.children).indexOf(e.target);
            cart.splice(index, 1);
            updateCart();
        }
    });
});
