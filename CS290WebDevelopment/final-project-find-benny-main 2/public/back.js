
back = document.getElementById("back")

back.onclick = function() {
    address = localStorage.getItem("address")

    if (address % 2 == 0) {
        localStorage.setItem("address", address / 2)
    }
    else {
        localStorage.setItem("address", (address - 1) / 2)
    }

    window.location.href = "../../doors.html"
}