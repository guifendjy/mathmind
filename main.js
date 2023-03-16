// select for display
var displayUsername = document.getElementById("user-name");

var gameStartButton = document.querySelector(".start-button");

var countDown = document.querySelector(".count-down");

var calculation = document.querySelector(".calculation");

var results = document.querySelectorAll("li");

var firstResult = document.getElementById("first-result");

var secondResult = document.getElementById("second-result");

var thirdResult = document.getElementById("third-result");

var fourthResult = document.getElementById("fourth-result");

var startOver = document.getElementById("play-again");

// alert
var alertScore = document.querySelector("#alert-score");

var closeAlert = document.querySelector("#close-alert");

var scoreDisplay = document.querySelector("#score");

var ul = document.querySelector("#list-score");

// event listeners
gameStartButton.addEventListener("click", () => {
  displayUsername.style.display = "none";
  document.getElementById("game-start").style.display = "none";
  document.getElementById("game").style.display = "block";
  gameStart();
});

results.forEach((li) => {
  li.addEventListener("click", function (e) {
    resultStyle(e);
  });
});

closeAlert.addEventListener("click", () => {
  alertScore.style.display = "none";
});

startOver.addEventListener("click", () => {
  document.querySelector(".play-game-again").style.display = "none";
  document.getElementById("game").style.display = "block";
  gameStart();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", displayUser);
}

// variables
var user = localStorage.getItem("username");
var timer = 5;
var round = 0;
var score = 0;
answerTimer = 1;
var operator = ["+", "-", "*", "/"];
var rightResult;
var timerInterval;
var allScores = [];
// <li> results
var liArr = [firstResult, secondResult, thirdResult, fourthResult];

// functions
function displayUser() {
  if (user != null) {
    displayUsername.innerText = "hi!" + " " + user;
  }
}

function clear() {
  round = 0;
  score = 0;
}

function calculate() {
  clearLiStyle();
  timer = 5;
  round++;
  let resultCalculation;
  console.log("round", round);
  var myCalculation = [];
  // first number
  var firstNumber = Math.floor(Math.random() * 10);
  myCalculation[0] = firstNumber.toString();

  // random operator
  let indexOperator = Math.floor(Math.random() * operator.length);
  var theOperator = operator[indexOperator];
  myCalculation[1] = theOperator;
  // second number
  var secondNumber = Math.floor(Math.random() * 9 + 1);
  myCalculation[2] = secondNumber.toString();

  // add to calculation display
  let sum = "";
  for (var i = 0; i < myCalculation.length; i++) {
    sum = sum + " " + myCalculation[i];
  }

  // display current calculation
  calculation.innerText = sum;
  // does the calculation, check if is integer or decimal, if decimal round places up to 3.
  isFloat = eval(calculation.innerText);
  if (isFloat % 1 === 0) {
    resultCalculation = isFloat;
  } else {
    resultCalculation = parseFloat(isFloat).toFixed(2);
  }
  console.log("result", resultCalculation);
  // displays game
  document.querySelector(".results").style.display = "grid";

  // <li> result ||| default
  // creates a list of different numbers
  const arr = [];
  while (arr.length < 4) {
    let randomNumber;
    if (resultCalculation <= 10) {
      randomNumber = Math.floor(Math.random() * 10);
    } else if (resultCalculation > 10 && resultCalculation <= 20) {
      randomNumber = Math.floor(Math.random() * 20) + 10;
    } else if (resultCalculation > 20 && resultCalculation <= 30) {
      randomNumber = Math.floor(Math.random() * 30) + 20;
    } else if (resultCalculation > 30 && resultCalculation <= 40) {
      randomNumber = Math.floor(Math.random() * 40) + 30;
    } else if (resultCalculation > 40 && resultCalculation <= 50) {
      randomNumber = Math.floor(Math.random() * 50) + 40;
    } else if (resultCalculation > 50 && resultCalculation <= 60) {
      randomNumber = Math.floor(Math.random() * 60) + 50;
    } else if (resultCalculation > 60 && resultCalculation <= 70) {
      randomNumber = Math.floor(Math.random() * 70) + 60;
    } else if (resultCalculation > 70 && resultCalculation <= 81) {
      randomNumber = Math.floor(Math.random() * 81) + 70;
    } else {
      // randomNumber = Math.floor(Math.random() * 100) + 1;
    }

    if (randomNumber === resultCalculation) continue;
    if (!arr.includes(randomNumber)) {
      arr.push(randomNumber);
    }
  }
  // add them to li-items
  for (var m = 0; m < liArr.length; m++) {
    liArr[m].innerText = arr[m];
    console.log(liArr[m].id, liArr[m].innerText);
  }

  // li results
  let indexLiArr = Math.floor(Math.random() * liArr.length);
  liArr[indexLiArr].innerText = resultCalculation;
  console.log("indexChosen", liArr[indexLiArr]);
  // setting the rightResult
  rightResult = liArr[indexLiArr].innerText;
}

// adds a style to right or wrong question and update score
function resultStyle(e) {
  e.stopPropagation();
  const target = e.target;
  if (target.innerText === rightResult) {
    target.style.backgroundColor = "green";
    score += 2;
    setTimeout(() => {
      calculate();
    }, 200);
  } else {
    target.style.backgroundColor = "red";
    // makes it more difficult
    // if(score > 0){
    // score--;
    // }
    setTimeout(() => {
      calculate();
    }, 200);
  }
  console.log("answerPicked", target.innerText);
  console.log("score", score);
}

function clearLiStyle() {
  for (var i = 0; i < results.length; i++) {
    if (
      results[i].style.backgroundColor === "red" ||
      results[i].style.backgroundColor === "green"
    ) {
      results[i].style.backgroundColor = "aqua";
    }
  }
}

// shows current and all previous score
function scoreShow() {
  alertScore.style.display = "block";
  allScores.push(score);
  var li = document.createElement("li");
  // ul.appendChild(li);
  ul.insertBefore(li, ul.firstChild);
  for (var i = 0; i < allScores.length; i++) {
    li.innerText = "score:" + " " + allScores[i].toString();
    // (i + 1).toString() + " " +(before every score)
  }
  console.log(allScores);
}

function count() {
  timer--;
  countDown.innerText = timer;
  if (timer <= 2) {
    countDown.style.color = "red";
  } else {
    countDown.style.color = "black";
  }
  if (timer === 0) {
    calculate();
  }

  // amount of rounds(stops after ten rounds)
  if (round === 12) {
    scoreShow();
    clearInterval(timerInterval);
    clearLiStyle();
    clear();
    clearInterval(timerInterval);
    // hide game and show play game again
    document.getElementById("game").style.display = "none";
    document.querySelector(".play-game-again").style.display = "block";
  }
}

function gameStart() {
  timerInterval = setInterval(count, 1000);
}
