document.addEventListener("DOMContentLoaded", function () {
    const itemForm = document.getElementById("post-item-form");
    const itemList = document.getElementById("items");

    itemForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const itemName = document.getElementById("item-name").value;
        const itemPrice = document.getElementById("item-price").value;
        const itemImage = document.getElementById("item-image").value;

        if (itemName && itemPrice && itemImage) {
            const listItem = document.createElement("li");
            const itemHTML = `
                <strong>${itemName}</strong> - $${itemPrice}
                <img src="${itemImage}" alt="${itemName}" style="max-width: 100px; max-height: 100px;">
                <button class="add-to-cart" data-name="${itemName}" data-price="${itemPrice}">Add to Cart</button>
            `;
            listItem.innerHTML = itemHTML;
            itemList.appendChild(listItem);

            // Clear the form
            document.getElementById("item-name").value = "";
            document.getElementById("item-price").value = "";
            document.getElementById("item-image").value = "";

            // Add a click event for the "Add to Cart" button
            const addToCartButton = listItem.querySelector(".add-to-cart");
            addToCartButton.addEventListener("click", addToCart);
        }
    });

    // Function to handle adding items to the cart
    function addToCart(event) {
        const itemName = event.target.getAttribute("data-name");
        const itemPrice = parseFloat(event.target.getAttribute("data-price"));

        // You can implement the cart functionality here, e.g., adding the item to the cart.
        // You may want to update the cart's total price and display the added items.
        // This code depends on your specific implementation.
    }
});