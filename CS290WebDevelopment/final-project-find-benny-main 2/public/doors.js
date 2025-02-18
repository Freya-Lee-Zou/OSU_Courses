
door_one = document.getElementById('door_one')
door_two = document.getElementById('door_two')

door_one.onclick = function() {
    localStorage.setItem("address", address * 2)
}

door_two.onclick = function() {
    localStorage.setItem("address", address * 2 + 1)
}

address = localStorage.getItem("address");
maze = JSON.parse(localStorage.getItem("maze"))

page = maze[address]["page"]

if (page == "doors.html") {
    door_one.setAttribute("href", maze[address]["door_one"]["page"])
    door_one.children[0].setAttribute("src", maze[address]["door_one"]["image"])
    door_two.setAttribute("href", maze[address]["door_two"]["page"])
    door_two.children[0].setAttribute("src", maze[address]["door_two"]["image"])
}
else {
    window.location.href = page
}
