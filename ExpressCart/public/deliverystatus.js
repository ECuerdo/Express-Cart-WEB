// You can add JavaScript code here to update the delivery status dynamically
document.addEventListener("DOMContentLoaded", function () {
    const statusMessage = document.getElementById("status-message");

    // Simulate a delay in updating the delivery status (you can replace this with actual logic)
    setTimeout(() => {
        statusMessage.textContent = "Your order is out for delivery. It should arrive within the next hour.";
    }, 3000); // Simulating a 3-second delay (adjust as needed)
});
