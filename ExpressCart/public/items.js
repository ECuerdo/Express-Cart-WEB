document.addEventListener("DOMContentLoaded", function () {
    const itemForm = document.getElementById("post-item-form");
    const itemList = document.getElementById("items");

    itemForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const itemName = document.getElementById("item-name").value;
        const itemPrice = document.getElementById("item-price").value;

        if (itemName && itemPrice) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${itemName}</strong> - $${itemPrice}`;
            itemList.appendChild(listItem);

            // Clear the form
            document.getElementById("item-name").value = "";
            document.getElementById("item-price").value = "";
        }
    });
});