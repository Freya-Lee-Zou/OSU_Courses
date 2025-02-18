/*
 * Log the user out by removing their authentication token and then redirect
 * back to the home page of the app.
 */
window.localStorage.removeItem("token")
window.location.href = "/"
