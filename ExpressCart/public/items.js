document.addEventListener("DOMContentLoaded", function () {
    const itemForm = document.getElementById("post-item-form");
    const itemList = document.getElementById("items");

    itemForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const itemName = document.getElementById("item-name").value;
        const itemPrice = document.getElementById("item-price").value;
        const itemImage = document.getElementById("item-image").files[0];

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
                `;
                listItem.innerHTML = itemHTML;
                itemList.appendChild(listItem);

                // Clear the form
                document.getElementById("item-name").value = "";
                document.getElementById("item-price").value = "";
                document.getElementById("item-image").value = "";
            } else {
                alert("Error posting item: " + data.error);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });

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
                `;
                listItem.innerHTML = itemHTML;
                itemList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
});
