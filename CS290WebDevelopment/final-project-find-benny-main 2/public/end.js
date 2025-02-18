var submit = document.getElementById("submit")

function nickname_submit()
{
    minutes = localStorage.getItem("minutes")
    seconds = localStorage.getItem("seconds")
    var nickname = document.getElementById("nickname-input").value
    if(nickname)
    {
        window.location.href = "/?name=" + nickname + "&m=" + minutes + "&s=" + seconds;
    }
    else
    {
        alert("Please, write your nickname")
    }
}
submit.addEventListener("click", nickname_submit)