
window.onload = function () {
    var minutes = localStorage.getItem("minutes")
    var seconds = localStorage.getItem("seconds");
    var appendSeconds = document.getElementById("seconds")
    var appendMinutes = document.getElementById("minutes")
    var Interval;

    clearInterval(Interval);
    Interval = setInterval(startTimer, 1000);

    function startTimer () {
      seconds++;

      if (seconds < 10) {
        appendSeconds.innerHTML = "0" + seconds
      }
      else if (seconds > 59) {
          minutes++;
          seconds = 0;

          appendSeconds.innerHTML = "0" + seconds
        }
      else {
        appendSeconds.innerHTML = seconds
      }

      if (minutes < 10) {
        appendMinutes.innerHTML = "0" + minutes
      }
      else {
        appendMinutes.innerHTML = minutes
      }

      localStorage.setItem("seconds", seconds);
      localStorage.setItem("minutes", minutes)
    }
}