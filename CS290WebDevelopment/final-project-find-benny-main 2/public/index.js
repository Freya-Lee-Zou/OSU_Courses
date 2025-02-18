
var backdrop = document.getElementById("backdrop")
function change_display(element, display) {
    backdrop.style.display = display
    element.style.display = display
}

var instructions = document.getElementById("instructions_button")
var instructions_container = document.getElementById("instructions_container")
instructions.onclick = function() {
    change_display(instructions_container, "block")
}


var about = document.getElementById("about_button")
var about_container = document.getElementById("about_container")
about.onclick = function() {
    change_display(about_container, "block")
}

var close_instructions = document.getElementById("close_instructions")
close_instructions.onclick = () => change_display(instructions_container, "none")

var close_about = document.getElementById("close_about")
close_about.onclick = () => change_display(about_container, "none")

function insertNewPost(name, score) {
    var newScore = Handlebars.templates.leaderboard({
        name: name,
        score: score
    })

    var leaderboardSection = document.getElementById('leaderboard');
    leaderboardSection.insertAdjacentHTML("beforeend", newScore);
}

min_depth = 1
max_depth = 3
benny_address = (Math.ceil(Math.random() * (2 ** max_depth - 2 ** min_depth))) + min_depth

function random_game() {
    games = [
        {
            page: 'games/find_the_joker/index.html',
            image: 'games/find_the_joker/cards/black_joker.svg'
        }, {
            page: 'games/math/math.html',
            image: 'games/math/music/mathpic.jpg'
        }, {
            page: 'games/hangman/hangman.html',
            image: 'games/hangman/forest.jpg'
        }
    ]

    return games[Math.floor(Math.random() * games.length)]
}

function doors() {
    one = random_game()
    two = random_game()

    while (two['page'] == one['page']) {
        two = random_game()
    }

    return [one, two]
}

function make_maze(depth = 0, address = 1) {
    addresses = Array(2 ** max_depth).fill().map((_, idx) => idx)
    maze = {}
  
    addresses.forEach(address => {
        if (address == 0) {
            maze[address] = {page: "/"}
        }
        else if (address == benny_address) {
            maze[address] = {page: "beaver.html"}
        }
        else if (Math.floor(Math.log2(address)) == max_depth - 1) {
            maze[address] = {page: "dead_end.html"}
        }
        else {
            games = doors()

            maze[address] = {page: "doors.html",
                door_one: games[0],
                door_two: games[1]
            }
        }
    });

    return maze
}

localStorage.setItem("maze", JSON.stringify(make_maze()))
localStorage.setItem("seconds", 0);
localStorage.setItem("minutes", 0);
localStorage.setItem("address", 1);
