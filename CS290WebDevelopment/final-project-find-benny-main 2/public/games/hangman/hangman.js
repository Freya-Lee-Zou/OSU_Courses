var answerArr = []
var wrongAnswers = 0;
var maxGuesses = 7;

var words = ['javascript', 'handlebars', 'node', 'code', 'bug',
  'deploy', 'express', 'github'];

var chosenWord; 
var remainingLetters; 
var wonGame = false; 

var letterButton = document.querySelectorAll('.letter_button');
if (letterButton) {
  letterButton.forEach(item => {
    item.addEventListener('click', handleClick);
  })
}
var display = document.getElementById('display_player_array');
var displayGuessesRemaining = document.getElementById('display_guesses_remaining');
var endMessage = document.getElementById('end_of_game_msg');

var canvas = document.getElementById('stage'),
  ctx = canvas.getContext('2d'); 

runGame();

function runGame() {
    answerArr = [];
    chosenWord = pickWord(words);
    remainingLetters = chosenWord.length;
    generatePlayerAnswerArray(chosenWord);
    displayPlayerArray(answerArr);
    updateGuessesRemaining();
}

function pickWord(wordArr) {
    var randomNumber = generateRandomNumber(wordArr);
    chosenWord = wordArr[randomNumber];

    return chosenWord;
}

function generateRandomNumber(arr) {
    return Math.floor(Math.random() * arr.length);
}

function generatePlayerAnswerArray (chosenWord) {
    for (var i = 0; i < chosenWord.length; i++) {
        answerArr.push('_');
    };
}

function displayPlayerArray(answerArr) {
    display.textContent = answerArr.join(' ');
}

function updateGuessesRemaining() {
    var guessesRemaining = maxGuesses - wrongAnswers;
    displayGuessesRemaining.textContent = 'Remaining guesses: ' + guessesRemaining;
}

function handleClick(event) {
    event.preventDefault();
  
    if (chosenWord.includes(event.target.value) === true) {
      for (var i = 0; i < chosenWord.length; i++) {
        if (event.target.value === chosenWord[i]) {
  
          answerArr[i] = chosenWord[i];
  
          displayPlayerArray(answerArr);
          updateGuessesRemaining();
          remainingLetters--;
          event.target.disabled = true;
          checkForWin();
        }
      }
    } else if (chosenWord.includes(event.target.value) === false) {
      displayPlayerArray(answerArr);
      wrongAnswers += 1;
      updateGuessesRemaining();
      event.target.disabled = true;
      checkForLoss();
    }
    drawCanvas(); 
}

function checkForWin() {
    if (remainingLetters === 0) { 
        wonGame = true;

        letterButton.forEach(item => {
          item.removeEventListener('click', handleClick);
        })
        displayPlayerArray(answerArr);
        window.location.href = '../../doors.html'
  }   
}

function checkForLoss() {
    if (remainingLetters > 0 && wrongAnswers === maxGuesses) {
        wonGame = false;
        drawCanvas();

        letterButton.forEach(item => {
          item.removeEventListener('click', handleClick);
        })

        endMessage.textContent = 'You failed to guess \'' + chosenWord + '.\' You must go back to the previous room and try again.';
      }  
}

function highlightPlayAgainBtn() {
    playAgainButton.style.color = 'white';
    playAgainButton.style.backgroundColor = '#8c1717';
}

//HANGMAN DRAWING DOWN BELOW:

ctx.lineWidth = 10;
ctx.strokeStyle = 'whitesmoke';
drawLine(ctx, [30,285], [270,285]);
ctx.stroke();

function drawLine(ctx , from, to) {
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.lineTo(to[0], to[1]);
  ctx.stroke();
}

function drawCanvas() {
  ctx.lineWidth = 10; 
  ctx.strokeStyle = 'whitesmoke'; 
  ctx.fillStyle = 'whitesmoke'; 
  if (wrongAnswers >= 1) {
    ctx.strokeStyle = 'whitesmoke';
    drawLine(ctx, [30,285], [270,285]); //draws the ground
  }
  if (wrongAnswers >= 1) { //creates the upright gallows:
    ctx.strokeStyle = 'whitesmoke';
    drawLine(ctx, [45,277.5], [45,15]);
  }
  if (wrongAnswers >= 1) { //creates the arm gallows:
    ctx.lineTo(225,15);
    ctx.stroke();
  }
  if (wrongAnswers >= 2) { //creates the noose:
    ctx.strokeStyle = 'whitesmoke';
    ctx.lineWidth = 3;
    drawLine(ctx, [217.5,22.5], [217.5,45]);

    ctx.beginPath(); //creates the head:
    ctx.moveTo(240, 67.5);
    ctx.arc(217.5, 67.5, 22.5, 0, (Math.PI / 180) * 360);
    ctx.stroke();
  }
  if (wrongAnswers >= 3) { //creates the body:
    drawLine(ctx, [217.5,90], [217.5,195]);
  }
  if (wrongAnswers >= 4) { //creates the left arm:
    drawLine(ctx, [217.5,120], [165,135]);
  }
  if (wrongAnswers >= 5) { //creates the right arm:
    drawLine(ctx, [217.5,120], [270,135]);
  }
  if (wrongAnswers >= 6) { //creates the left leg:
    drawLine(ctx, [217.5,195], [195,255]);
  }
  if (wrongAnswers >= 7) { //creates the right leg and ends game
    drawLine(ctx, [217.5,195], [240,255]);
  }
}