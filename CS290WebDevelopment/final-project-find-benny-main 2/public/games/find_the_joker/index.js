
numbers = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10']
words = ['jack', 'queen', 'king']
suites = ['spades', 'clubs', 'diamonds', 'hearts']

cards = []

suites.forEach(suite => {
    numbers.forEach(number => {
        cards.push('cards/' + number + '_of_' + suite + '.svg')
    })
    words.forEach(word => {
        cards.push('cards/' + word + '_of_' + suite + '2.svg')
    })
});

joker_container = document.getElementById('joker-container')
joker = document.getElementById('joker')
table = document.getElementById('table')

height = table.offsetHeight - 256
width = table.offsetWidth - 176

joker_container.style.display = 'none'

function random_position(element) {
    element.style.top = 128 + Math.random() * height + 'px'
    element.style.left = Math.random() * width + 'px'
}

depths = Array.from(Array(52).keys()).sort((a, b) => 0.5 - Math.random())
cards.forEach(card => {
    new_card = joker.cloneNode(true)
    new_card.removeAttribute('id')
    new_card.src = card
    random_position(new_card)
    
    z = depths.pop()
    if (z == 0) {
        joker_container.style.top = new_card.style.top
        joker_container.style.left = new_card.style.left
    }

    new_card.style.zIndex = z
    table.append(new_card)
});

joker.removeAttribute('class')

setTimeout(() => {
        joker_container.style.display = "block"
    },
    1000
)

var x = 0
var y = 0
function drag_start(event) {
    this.style.opacity = '0'
    x = event.clientX - this.style.left.slice(0, -2)
    y = event.clientY - this.style.top.slice(0, -2)

    event.dataTransfer.effectAllowed = "move"
}

function drag_end(event){
    new_x = Math.min(width, Math.max(0, event.clientX - x))
    new_y = Math.min(height + 128, Math.max(128, event.clientY - y))
    this.style.left = new_x + "px"
    this.style.top = new_y + "px"

    cards.forEach(card => {
        if (card.style.zIndex > this.style.zIndex) {
            card.style.zIndex = card.style.zIndex - 1
        }
    })

    this.style.zIndex = 51
    this.style.opacity = '1'
}

cards = document.querySelectorAll('.card')
cards.forEach(card => {
    card.addEventListener('dragstart', drag_start)
    card.addEventListener('dragend', drag_end)
})
