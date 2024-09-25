// Function to delete the 'token' cookie
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// Function to handle logout
function handleLogout() {
    // Delete the 'token' cookie
    deleteCookie('token');

}

// Attach the logout handler to the "Đăng xuất" button
document.querySelector('.header-actions a[href="#"]').addEventListener('click', function(event) {
    event.preventDefault();
    handleLogout();
});
