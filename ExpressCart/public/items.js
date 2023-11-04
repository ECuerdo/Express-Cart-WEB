document.addEventListener("DOMContentLoaded", function () {
    const itemForm = document.getElementById("post-item-form");
    const itemList = document.getElementById("items");

    // Event listener for submitting the item form
    itemForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get item details from the form
        const itemName = document.getElementById("item-name").value;
        const itemPrice = document.getElementById("item-price").value;
        const itemImage = document.getElementById("item-image").files[0];

        // Create form data to send via POST request
        const formData = new FormData();
        formData.append("itemName", itemName);
        formData.append("itemPrice", itemPrice);
        formData.append("productImage", itemImage);

        // Send a POST request to save the item to /index
        fetch("/index", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Item saved successfully") {
                // Create a list item element to display the added item
                const listItem = document.createElement("li");
                const itemHTML = `
                    <strong>${itemName}</strong> - $${itemPrice}
                    <img src="${data.imagePath}" alt="${itemName}" style="max-width: 100px; max-height: 100px;">
                    <button class="add-to-cart-btn" data-id="${data.itemId}" data-name="${itemName}" data-price="${itemPrice}" data-image="${data.imagePath}">Add to Cart</button>
                `;
                listItem.innerHTML = itemHTML;
                itemList.appendChild(listItem);

                // Clear the form
                document.getElementById("item-name").value = "";
                document.getElementById("item-price").value = "";
                document.getElementById("item-image").value = "";

                // Add event listener for Add to Cart button
                const addToCartButton = listItem.querySelector(".add-to-cart-btn");
                addToCartButton.addEventListener("click", addToCart);
            } else {
                alert("Error posting item: " + data.error);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });

    // Function to handle adding items to the cart
    function addToCart(event) {
        const itemId = event.target.getAttribute("data-id");
        const itemName = event.target.getAttribute("data-name");
        const itemPrice = parseFloat(event.target.getAttribute("data-price"));
        const itemImage = event.target.getAttribute("data-image");

        // Retrieve cart data from cookies
        let listCart = [];
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('listCart='));
        if (cookieValue) {
            listCart = JSON.parse(cookieValue.split('=')[1]);
        }

        // Add the selected item to the cart
        const cartItem = { id: itemId, name: itemName, price: itemPrice, image: itemImage, quantity: 1 };
        listCart.push(cartItem);

        // Save the updated cart in the cookie
        document.cookie = `listCart=${JSON.stringify(listCart)};path=/`;

        // Perform any other actions you need with the updated cart
        // ...

        // Example: Update cart display
        // addCartToHTML();
    }

    // Fetch items from the server when the page loads
    fetch("/index")
        .then(response => response.json())
        .then(items => {
            // Display items fetched from the server
            items.forEach(item => {
                const listItem = document.createElement("li");
                const itemHTML = `
                    <strong>${item.name}</strong> - $${item.price}
                    <img src="${item.image}" alt="${item.name}" style="max-width: 100px; max-height: 100px;">
                    <button class="add-to-cart-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">Add to Cart</button>
                `;
                listItem.innerHTML = itemHTML;
                itemList.appendChild(listItem);

                // Add event listener for Add to Cart button
                const addToCartButton = listItem.querySelector(".add-to-cart-btn");
                addToCartButton.addEventListener("click", addToCart);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
});
