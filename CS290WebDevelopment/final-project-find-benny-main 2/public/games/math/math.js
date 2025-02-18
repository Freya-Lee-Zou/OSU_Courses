let operators = ["+", "-", "*"];
const startBtn = document.getElementById("start-btn");
const question = document.getElementById("question");
const controls = document.querySelector(".controls-container");
const next = document.getElementById("next")
const result = document.getElementById("result");
const submitBtn = document.getElementById("submit-btn");
const errorMessage = document.getElementById("error-msg");
let answerValue;
let operatorQuestion;

const fraDom = document.getElementsByClassName("fraction")[0];

let fraction = 0
let username = ""

//Random Value Generator
const randomValue = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const questionGenerator = () => {
  //Two random values between 1 and 18
  let [num1, num2] = [randomValue(1, 18), randomValue(1, 20)];

  //For getting random operator
  let randomOperator = operators[Math.floor(Math.random() * operators.length)];

  if (randomOperator == "-" && num2 > num1) {
    [num1, num2] = [num2, num1];
  }

  //Solve equation
  let solution = eval(`${num1}${randomOperator}${num2}`);

  //For placing the input at random position
  //(1 for num1, 2 for num2, 3 for operator, anything else(4) for solution)
  let randomVar = randomValue(1, 5);

  if (randomVar == 1) {
    answerValue = num1;
    question.innerHTML = `<input type="number" id="inputValue" placeholder="?"\> ${randomOperator} ${num2} = ${solution}`;
  } else if (randomVar == 2) {
    answerValue = num2;
    question.innerHTML = `${num1} ${randomOperator}<input type="number" id="inputValue" placeholder="?"\> = ${solution}`;
  } else if (randomVar == 3) {
    answerValue = randomOperator;
    operatorQuestion = true;
    question.innerHTML = `${num1} <input type="text" id="inputValue" placeholder="?"\> ${num2} = ${solution}`;
  } else {
    answerValue = solution;
    question.innerHTML = `${num1} ${randomOperator} ${num2} = <input type="number" id="inputValue" placeholder="?"\>`;
  }
};

//User Input Check
submitBtn.addEventListener("click", () => {
  errorMessage.classList.add("hide");
  let userInput = document.getElementById("inputValue").value;
  //If user input is not empty
  if (userInput) {
    //If the user guessed correct answer
    if (userInput == answerValue) {
      // stopGame(`YEAH!! <span>Correct</span> Answer`);
      fraction += 10
      fraDom.innerHTML = "score: " + fraction
      if(fraction == 50) {
        save()
        stopGame(`YEAH!! <span>Correct</span> Answer`);
      }
    }
    //If user inputs operator other than +,-,*
    else if (operatorQuestion && !operators.includes(userInput)) {
      errorMessage.classList.remove("hide");
      errorMessage.innerHTML = "Please enter a valid operator";
      return
    }
    //If user guessed wrong answer
    else {
      stopGame(`Opps!! <span>Wrong</span> Answer`);
      save()
      return
    }
  }
  //If user input is empty
  else {
    errorMessage.classList.remove("hide");
    errorMessage.innerHTML = "Opps!You forgot something!!";
    return
  }
  operatorQuestion = false;
  questionGenerator()
});

//Start Game
startBtn.addEventListener("click", () => {
  // username = document.getElementById("username").value
  // if(username.length === 0) {
  //   document.getElementById("username").style.border = '1px solid red'
  //   return
  // }
  document.getElementById("username").style.border = 'none'
  operatorQuestion = false;
  answerValue = "";
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hide");
  //Controls and buttons visibility
  controls.classList.add("hide");
  startBtn.classList.add("hide");
  document.getElementsByClassName("listDesc")[0].style.display = 'none'
  document.getElementsByClassName("stage")[0].style.display = 'inline-block'
  document.getElementsByClassName("stage")[1].style.display = 'inline-block'
  document.getElementsByClassName("stage")[2].style.display = 'inline-block'
  questionGenerator();
});

//Stop Game
const stopGame = (resultText) => {
  result.innerHTML = resultText;
  startBtn.innerText = "Restart";
  controls.classList.remove("hide");

  // This is needed so that "back.js" can control the flow of the website
  back.classList.add("hide");
  next.classList.remove("hide");
  
  startBtn.classList.remove("hide");
  document.getElementsByClassName("listDesc")[0].style.display = 'fixed'
};


function save() {
  console.log(fraction, username);
  fraDom.innerHTML = "score: " + 0
  let url = `http://localhost:3000/api?username=${username}&fraction=${fraction}`;
  let httpRequest = new XMLHttpRequest();
  httpRequest.open('GET', url, true);
  httpRequest.send();
  fraction =0;
}

