let listCart = [];
function checkCart(){
        var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
        if(cookieValue){
            listCart = JSON.parse(cookieValue.split('=')[1]);
        }
}
checkCart();
addCartToHTML();
function addCartToHTML(){
    // clear data default
    let listCartHTML = document.querySelector('.returnCart .list');
    listCartHTML.innerHTML = '';

    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');
    let totalQuantity = 0;
    let totalPrice = 0;
    // if has product in Cart
    if(listCart){
        listCart.forEach(product => {
            if(product){
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = 
                    `<img src="${product.image}">
                    <div class="info">
                        <div class="name">${product.name}</div>
                        <div class="price">$${product.price}/1 product</div>
                    </div>
                    <div class="quantity">${product.quantity}</div>
                    <div class="returnPrice">$${product.price * product.quantity}</div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
                totalPrice = totalPrice + (product.price * product.quantity);
            }
        })
    }
    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = '$' + totalPrice;
}

document.addEventListener("DOMContentLoaded", function () {
    // ... (previous code remains unchanged)

    // Event listener for the checkout button
    const checkoutButton = document.querySelector(".buttonCheckout");
    checkoutButton.addEventListener("click", function () {
        // Get user input from the checkout form
        const fullName = document.getElementById("name").value;
        const phoneNumber = document.getElementById("phone").value;
        const address = document.getElementById("address").value;

        // Retrieve cart data from cookies
        let listCart = [];
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('listCart='));
        if (cookieValue) {
            listCart = JSON.parse(cookieValue.split('=')[1]);
        }

        // Validate the checkout data (you can add more validation if needed)
        if (!fullName || !phoneNumber || !address) {
            alert("Please fill out all fields in the checkout form.");
            return;
        }

        // Perform actions for the checkout process, such as sending the order to the server,
        // clearing the cart, and redirecting the user to the delivery status page.
        
        // Example: Sending the order to the server (assuming you have an API endpoint for placing orders)
         const orderData = { fullName, phoneNumber, address, items: listCart };
        fetch("/place-order", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(orderData)
         })
         .then(response => response.json())
         .then(orderResponse => {
             if (orderResponse.success) {
                 alert("Order placed successfully!");
                 // Clear the cart in the cookie
                 document.cookie = "listCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                 // Clear the form
                 document.getElementById("name").value = "";
                 document.getElementById("phone").value = "";
                 document.getElementById("address").value = "";
                 // Redirect to the delivery status page
                 window.location.href = "/deliverystatus";
             } else {
                 alert("Failed to place the order. Please try again later.");
             }
         })
         .catch(error => {
             console.error("Error placing order:", error);
         });

        // Example: Clear the cart in the cookie and clear the form (you can perform this action after a successful order placement)
        document.cookie = "listCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("address").value = "";

        // Redirect to the delivery status page
        window.location.href = "/deliverystatus";
    });
});

