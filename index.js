// variable
var submit = document.getElementById("submit");
var userName = document.getElementById("input");

// if username exist go straight to game
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    loadGame();
  });
}

// save name and load game
submit.addEventListener("click", () => {
  userNameStorage();
});

// loadgame if username exist
function loadGame() {
  if (localStorage.getItem("username") != null) {
    document.querySelector(".container").innerText = "loading...";
    window.location.assign("main.html");
  }
}

// store username in localStorage
function userNameStorage() {
  if (userName.value != "") {
    window.location.assign("/main.html");
    localStorage.setItem("username", userName.value);
  }
  if (userName.value === "") {
    input.style.border = "1px solid red";
    document.querySelector(".error").innerText = "username required";
  }
}
