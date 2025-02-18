const form = document.getElementById("login-form")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")

/*
 * Hook up a form submission listener that validate the email and password
 * entered by user, and if they are valid, clears the form and displays a
 * success message.  If the email and/or password aren't valid, the listener
 * doesn't clear the form and displays an informative error message.
 */
form.addEventListener("submit", function (event) {
    event.preventDefault()
    clearStatusMessages()

    const email = emailInput.value
    const password = passwordInput.value

    /*
     * If the user provided valid credentials, store an authentication "token"
     * and redirect to the home page of the app.
     */
    if (authenticateUser(email, password)) {
        storeAuthToken()
        window.location.href = "/"
    } else {
        displayError()
    }
})

/*
 * This function "authenticated" the user by comparing their provided email
 * address and password against the locally stored credentials.  This is only
 * a fake registration function.  It's not secure.
 */
function authenticateUser(email, password) {
    const userJson = window.localStorage.getItem("user")
    if (userJson) {
        const user = JSON.parse(userJson)
        return user && user.email === email && user.password === password
    } else {
        return false
    }
}

/*
 * This function stores an authentication "token" locally to indicate that
 * the user is successfully logged in.
 */
function storeAuthToken() {
    window.localStorage.setItem("token", "1234567890abcdef")
}

/*
 * This function displays an error message to let the user know the credentials
 * they entered were not valid.
 */
function displayError() {
    const errorDiv = document.createElement("div")
    errorDiv.classList.add("error", "status")
    errorDiv.setAttribute("role", "alert")

    errorDiv.innerHTML = "<h3>❌ Error</h3>"
    errorDiv.innerHTML += "<p>The credentials you entered are invalid.</p>"

    form.appendChild(errorDiv)
}

/*
 * This function removes any error message or success message currently being
 * displayed to the user.
 */
function clearStatusMessages() {
    const statuses = form.querySelectorAll(".status")
    statuses.forEach(function (status) {
        status.remove()
    })
}
