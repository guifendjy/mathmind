import "../styles/main.css";
import "./modules/levelMod.mjs";
import "./modules/mathJax";
import { getUserData, updateUserProfile } from "./modules/savePlayers";
// select for display
var quote = document.querySelector(".quote");
var author = document.querySelector(".author");
var displayUsername = document.getElementById("user-name");

var gameStartButton = document.querySelector(".start-button");

var countDown = document.querySelector(".count-down");

var calculation = document.querySelector(".calculation");

var results = document.querySelectorAll("li");

var startOver = document.getElementById("play-again");

// alert
var alertScore = document.querySelector("#alert-score");

var closeAlert = document.querySelector("#close-alert");

var ul = document.querySelector("#list-score");
let stopGame = document.getElementById("stop");

// event listeners
let imported;
gameStartButton.addEventListener("click", async () => {
  const { generateRandomResults, generateCalculation, calculateResult } =
    await import("./modules/levelMod.mjs");
  imported = { generateRandomResults, generateCalculation, calculateResult };
  setTimer();
  displayUsername.style.display = "none";
  document.getElementById("game-start").style.display = "none";
  document.getElementById("game").style.display = "block";
});

results.forEach((li) => {
  li.addEventListener("click", function (e) {
    updateScore(e);
  });
});

closeAlert.addEventListener("click", () => {
  alertScore.style.display = "none";
});

startOver.addEventListener("click", () => {
  document.querySelector(".play-game-again").style.display = "none";
  document.getElementById("game").style.display = "block";
  setTimer();
});

document.addEventListener("DOMContentLoaded", () => {
  displayUser();
  import("./modules/randomQuote").then((randomQuote) => {
    randomQuote.default([author, quote]);
  });
});

// Global variables
// replace with data sent via URLparams
// reads data sent from first page(main.html) => put this code in main.js
const URLS = window.location.href;
let params = new URL(URLS).searchParams;
let entries = new URLSearchParams(params).entries();
let username = Array.from(entries)[0][1];

// data var contains the params sent
let timer;
let round = 0;
let level = 0;
let score = 0;
let timerInterval;
let rightResult;
let allScores = [];
// <li> results
// let liArr = [firstResult, secondResult, thirdResult, fourthResult];

// functions
function displayUser() {
  if (username) {
    displayUsername.innerText = "hi!" + " " + username;
  }
}

// can turn this into call to a server to fetch calculations
// for now it'll keep track of level and round to change
//  which type of calculation to generate.
function calculate() {
  clearLiStyle();
  // return and array([[...number&operator], newTimer]) generate calculation.
  const [myCalculation, newTimer] = imported.generateCalculation(level, timer);
  timer = newTimer;
  // return result of my calculation
  const [resultCalculation, prettyDisplay] = imported.calculateResult(
    myCalculation,
    level
  );
  if (!isFinite(parseFloat(resultCalculation))) {
    calculate();
    return;
  }
  const [rightResultIndex, randomNumbers] = imported.generateRandomResults(
    resultCalculation,
    level
  );
  displayCalculation(prettyDisplay);
  // show list of choices(pos results)
  document.querySelector(".results").style.display = "grid";
  displayRandomNumbers(randomNumbers);
  rightResult = rightResultIndex;
  console.log(rightResult);
  buttonDisabled = false;
  // increases round
  round += 1;
}

// here we can format the calculation
// that the user sees(with mathjs and mathjax)
function displayCalculation(toTexOperation) {
  MathJax.typeset();
  MathJax.typesetPromise()
    .then(() => {
      // modify the DOM here
      calculation.innerHTML = toTexOperation;
      MathJax.typesetPromise([calculation]);
    })
    .catch((err) => console.log(err.message));
  MathJax.texReset();
}

function displayRandomNumbers(toTexResult) {
  toTexResult.forEach((texResult, index) => {
    MathJax.typeset();
    MathJax.typesetPromise()
      .then(() => {
        // modify the DOM here
        results[index].innerText = texResult;
        MathJax.typesetPromise([results[index]]);
      })
      .catch((err) => console.log(err.message));
    MathJax.texReset();
  });
}

// adds a style to right or wrong question and update score
// BUGGG- if clicked repeatedly it will make (round) exceed 12.
// buttonDisable might fix the bug but not sure!!!
let buttonDisabled = false;
function updateScore(e) {
  e.stopPropagation();
  const target = e.target;

  if (target.matches("li")) {
    if (buttonDisabled == true) return;
  }
  // checks rigth answer
  if (
    Array.prototype.indexOf.call(target.parentNode.children, target) ==
    rightResult
  ) {
    // use fontawesome dynamiclly for this to work
    // or use svg but might need svg loader for webpack
    target.innerHTML = `<i class="fa-solid fa-check" style="color:white;"></i>`;
    target.style.backgroundColor = "green";
    score += 2;
    buttonDisabled = true;
    setTimeout(() => {
      gameStop();
      calculate();
    }, 300);
  } else {
    target.innerHTML = `<i class="fa-solid fa-xmark" style="color:white;"></i>`;
    target.style.backgroundColor = "red";
    // makes it more difficult (dcrs by 1)
    if (score > 0) {
      score--;
    }
    buttonDisabled = true;
    setTimeout(() => {
      gameStop();
      calculate();
    }, 300);
  }
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
  ul.insertBefore(li, ul.firstChild);
  for (var i = 0; i < allScores.length; i++) {
    li.innerHTML = `<p style="word-spacing: .75em;">${i.toString()}- score ${allScores[
      i
    ].toString()}</p>`;
  }
  // hide game and show play game again
  document.getElementById("game").style.display = "none";
  document.querySelector(".play-game-again").style.display = "block";
}

function gameTimer() {
  countDown.innerText = isNaN(timer) ? "" : timer--;
  if (timer < 3) countDown.style.color = "red";
  if (timer > 3) countDown.style.color = "black";

  if (timer >= 0) return;
  gameStop();
  calculate();
}
function gameStop() {
  if (round !== 12) return;
  round = 0;
  level++;
  if (level !== 4) return;
  stop();
  clearInterval(timerInterval);
  scoreShow();
  updateUserData(username, allScores);
  clearGame();
}

// abrupt stop
stopGame.onclick = () => {
  clearInterval(timerInterval);
  scoreShow();
  updateUserData(username, allScores);
  clearGame();
};
// clear game
function clearGame() {
  countDown.innerText = "";
  timer = 0;
  level = 0;
  score = 0;
}

function setTimer() {
  timerInterval = setInterval(gameTimer, 1000);
}

function updateUserData(username, allScores) {
  let getAvg = getUserData({ username });
  // new average score
  let avgScore;
  const oldavgScore = getAvg.avgScore[0];
  const oldNumPoints = getAvg.avgScore[1];

  const newTotalPoints = oldNumPoints + allScores.length;
  const newTotalScore =
    oldavgScore * oldNumPoints + allScores.reduce((a, b) => a + b, 0);
  const newAverage = newTotalScore / newTotalPoints;

  avgScore = [Math.round(newAverage * 10) / 10, newTotalPoints];
  console.log(avgScore);

  let data = { username, avgScore };
  updateUserProfile(data);
}
