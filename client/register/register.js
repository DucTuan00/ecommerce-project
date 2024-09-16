// Handle form submission
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('errorMessage');

    // Clear any previous error messages
    errorMessage.textContent = '';

    // Validate form inputs
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match!';
        return;
    }

    // Create the request payload
    const payload = {
        username: username,
        password: password,
        role_id: 2
    };

    try {
        // Make the API request
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful!');
            // Optionally, redirect to another page
            // window.location.href = '/login.html';
        } else {
            // Display error message from API
            errorMessage.textContent = data.message || 'An error occurred. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Failed to register. Please check your connection and try again.';
    }
});

// Ensure form submission when "Đăng ký" button is clicked
document.getElementById('signUpButton').addEventListener('click', function() {
    // Prevent triggering multiple submissions
    if (!document.getElementById('registerForm').checkValidity()) {
        return; // Prevent submission if form is invalid
    }

    // Trigger form submission manually
    document.getElementById('registerForm').dispatchEvent(new Event('submit'));
});
