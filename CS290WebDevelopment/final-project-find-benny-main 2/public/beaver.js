
beaver = document.getElementById('beaver')

beaver.onclick = function() {
    minutes = localStorage.getItem("minutes")
    seconds = localStorage.getItem("seconds")

    window.location.href = "end/?m=" + minutes + "&s=" + seconds
}