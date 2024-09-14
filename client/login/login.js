// Handle form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Clear any previous error messages
    errorMessage.textContent = '';

    // Create the request payload
    const payload = {
        username: username,
        password: password
    };

    try {
        // Make the API request
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login successful!');
            // Optionally, redirect to another page
            // window.location.href = '/home.html'; // Change this to the desired redirect URL
        } else {
            // Display error message from API
            errorMessage.textContent = data.message || 'An error occurred. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Failed to log in. Please check your connection and try again.';
    }
});

// Ensure form submission when "Đăng nhập" button is clicked
document.getElementById('loginButton').addEventListener('click', function() {
    // Prevent triggering multiple submissions
    if (!document.getElementById('loginForm').checkValidity()) {
        return; // Prevent submission if form is invalid
    }

    // Trigger form submission manually
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
});
