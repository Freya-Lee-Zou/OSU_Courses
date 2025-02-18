displayHistory()

/*
 * If the user clicks the "clear" button, clear the history and navigate to
 * the app's home page.
 */
const clearButton = document.getElementById("clear-button")
clearButton.addEventListener("click", function () {
    window.localStorage.removeItem("history")
    window.location.href = "/"
})

/*
 * Loads and displays the history.
 */
function displayHistory() {
    const historyList = document.getElementById("history-list")
    const history = loadHistory()
    if (history.length > 0) {
        for (let i = 0; i < history.length; i++) {
            const historyListItem = document.createElement("li")
            historyListItem.textContent = `${history[i].calc} = ${history[i].result}`
            historyList.append(historyListItem)
        }
    } else {
        const emptyItem = document.createElement("li")
        emptyItem.classList.add("no-decoration")
        emptyItem.textContent = "History is empty"
        historyList.append(emptyItem)
    }
}

/*
 * Loads the user's calculation history and returns it if they are logged in.
 */
function loadHistory() {
    const isLoggedIn = window.localStorage.getItem("token")
    if (isLoggedIn) {
        const historyJson = window.localStorage.getItem("history")
        return historyJson && JSON.parse(historyJson) || []
    } else {
        return []
    }
}
