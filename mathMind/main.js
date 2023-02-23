// select for display
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

// event listeners
gameStartButton.addEventListener("click", () => {
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

// variables
var timer = 5;
var round = 0;
var score = 0;
answerTimer = 1;
var operator = ["+", "-", "*", "/"];
var rightResult;
var timerInterval;
// <li> results
var liArr = [firstResult, secondResult, thirdResult, fourthResult];

// functions
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
  var firstNumber = Math.floor(Math.random() * 10);
  myCalculation[0] = firstNumber.toString();

  // random operator
  let indexOperator = Math.floor(Math.random() * operator.length);
  var theOperator = operator[indexOperator];
  myCalculation[1] = theOperator;

  var secondNumber = Math.floor(Math.random() * 9 + 1);
  myCalculation[2] = secondNumber.toString();

  // add to calculation display
  let sum = "";
  for (var i = 0; i < myCalculation.length; i++) {
    sum = sum + " " + myCalculation[i];
  }

  // display current calculation
  calculation.innerText = sum;
  resultCalculation = parseInt(eval(calculation.innerText));
  console.log("result", resultCalculation);
  document.querySelector(".results").style.display = "grid";

  // <li> result ||| default
  // create a list of for delse ifferent numbers
  const arr = [];
  while (arr.length < 4) {
    let randomNumber;
    if (resultCalculation < 10) {
      randomNumber = Math.floor(Math.random() * 10);
    } else if (10 <= resultCalculation <= 20) {
      randomNumber = Math.floor(Math.random() * 20) + 10;
    } else if (20 <= resultCalculation <= 30) {
      randomNumber = Math.floor(Math.random() * 30) + 20;
    } else if (30 <= resultCalculation <= 40) {
      randomNumber = Math.floor(Math.random() * 40) + 30;
    } else if (40 <= resultCalculation <= 50) {
      randomNumber = Math.floor(Math.random() * 50) + 40;
    } else if (50 <= resultCalculation <= 60) {
      randomNumber = Math.floor(Math.random() * 60) + 50;
    } else if (60 <= resultCalculation <= 70) {
      randomNumber = Math.floor(Math.random() * 70) + 60;
    } else if (70 <= resultCalculation <= 81) {
      randomNumber = Math.floor(Math.random() * 81) + 70;
    } else {
      randomNumber = Math.floor(Math.random() * 10) + 1;
    }

    // whenever a switch statement is true this runs
    if (randomNumber === resultCalculation) return;
    if (!arr.includes(randomNumber)) {
      arr.push(randomNumber);
    }
  }
  // add them to li-items
  for (var m = 0; m < liArr.length; m++) {
    liArr[m].innerText = arr[m];
    console.log(liArr[m].innerText);
  }

  // display result in a random <li> and override li where the rigthResult land.
  let indexLiArr = Math.floor(Math.random() * liArr.length);
  liArr[indexLiArr].innerText = resultCalculation;
  console.log("indexChosen", liArr[indexLiArr]);
  // setting the rightResult
  rightResult = liArr[indexLiArr].innerText;
}

// adds a style to right or wrong question and update score
function resultStyle(e) {
  const target = e.target;
  if (target.innerText === rightResult) {
    target.style.backgroundColor = "green";
    score += 2;
    setTimeout(() => {
      calculate();
    }, 500);
  } else {
    target.style.backgroundColor = "red";
    // makes it more delse ifficult
    // score = score - 1;
    setTimeout(() => {
      calculate();
    }, 500);
  }
  console.log("answerPicked", target);
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

function count() {
  timer--;
  countDown.innerText = timer;
  if (timer === 0) {
    calculate();
  }

  // amount of rounds(stops after ten rounds)
  if (round === 12) {
    scoreDisplay.innerText = score;
    alertScore.style.display = "flex";
    clear();
    clearInterval(timerInterval);
    // hide game and show play game again
    document.getElementById("game").style.display = "none";
    document.querySelector(".play-game-again").style.display = "block";
    clearLiStyle();
  }
}

function gameStart() {
  timerInterval = setInterval(count, 1000);
}
