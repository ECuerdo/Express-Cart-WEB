// Get references to the pop-up elements
const popup = document.getElementById('popupContainer');
const closeButton = document.getElementById('popupCloseButton');
const showButton = document.getElementById('showPopupButton');
const productForm = document.getElementById('productForm');

// Event listener for the show button
showButton.addEventListener('click', () => {
    // Show the pop-up
    popup.style.display = 'block';
});

// Event listener for the close button
closeButton.addEventListener('click', () => {
    // Hide the pop-up
    popup.style.display = 'none';
});

// Event listener for form submission
productForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from submitting

    // Get the product name, price, and image file from the form
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').files[0]; // Get the first selected file

    // Create a new product object with the data
    const newProduct = {
        name: productName,
        price: parseFloat(productPrice),
        image: productImage,
    };

    // You can handle the product data as needed (e.g., add to a list, send to a server, etc.)

    // Clear the form fields
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImage').value = '';

    // Close the pop-up
    popup.style.display = 'none';
});