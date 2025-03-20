import { isArray } from "mathjs";
import "../styles/index.css";
import {
  getUsers,
  createUserProfile,
  deleteUserProfile,
} from "./modules/savePlayers";
// variable
var submit = document.getElementById("submit");
var userName = document.getElementById("input");
var profileList = document.getElementById("profiles");
let ul = document.getElementById("list-profiles");
let showData = true;

// if username exist go straight to game
document.addEventListener("DOMContentLoaded", () => {
  renderProfiles();
  profileList.addEventListener("click", () => {
    profileList.classList.toggle("active");
    if (!showData) {
      ul.style.display = "none";
      showData = true;
    } else {
      ul.style.display = "block";
      showData = false;
    }
  });
});

function renderProfiles() {
  // make profile options clickable(send to second page-with the username save as URLparam)
  const profiles = getUsers();
  if (!isArray(profiles) || profiles.length == 0) {
    ul.textContent = "no profiles";
    return;
  }
  let sortedProfiles = profiles.sort((a, b) =>
    a.avgScore[1] > b.avgScore[1] ? -1 : 1
  ); // biggest first

  sortedProfiles.forEach((profile) => {
    let listItem = document.createElement("li");
    listItem.className = "profile-slot";

    listItem.innerHTML = `<p>username: ${profile.username} | avgscore: ${profile.avgScore[0]}</p>`;
    // create delete and edit buttons for profiles
    let buttons = document.createElement("div");
    buttons.className = "edit-delete";
    buttons.innerHTML = `<i class="fa-regular fa-trash-can">`;
    listItem.appendChild(buttons);
    // add whole li with data and inner element to ul
    ul.appendChild(listItem);
    // hover handler
    buttons.onclick = (e) => {
      const target = e.target;
      if (target.classList.contains("fa-trash-can")) {
        deleteUserProfile({ username: profile.username });
        ul.innerText = "";
        renderProfiles();
      }
    };
    // makes li(only <p> tag) clickable(and loadgame)
    listItem.childNodes[0].addEventListener("click", () => {
      loadgame({ username: profile.username });
    });
  });
}

userName.oninput = (event) => {
  const input = event.target;
  input.classList.remove("error");
  document.getElementById("error-message").textContent = "";
};

// save name and load game
submit.addEventListener("click", () => {
  let isValid = inputValidator({ username: userName.value });
  if (isValid.message) {
    userName.classList.add("error");
    document.getElementById("error-message").textContent = isValid.message;
  } else {
    // creates a new profile(with initial values avgScore -> lastAvgscr and last count)
    createUserProfile({ username: userName.value, avgScore: [0, 0] });
    loadgame({ username: userName.value });
  }
  // clear input
  userName.value = "";
});

function inputValidator({ username }) {
  if (username.trim() === "") {
    return { message: "Username is required" };
  }

  const usernameRegex = /^[A-Za-z][a-z]{2,10}$/;

  if (!usernameRegex.test(username)) {
    return { message: "Not a valid username" };
  }

  const profiles = getUsers();

  if (profiles && profiles.length >= 5) {
    return { message: "Profiles are full" };
  }

  const isUsernameExists =
    profiles &&
    profiles.some(
      (profile) => profile.username.toLowerCase() === username.toLowerCase()
    );

  if (isUsernameExists) {
    return { message: "Username already exists" };
  }

  return {};
}

// store username in localStorage
function loadgame({ username }) {
  if (username != "") {
    // send data to second page(from index.html)
    let searchParams = new URLSearchParams({ username });
    const queryString = searchParams.toString();
    let url = "./main.html";
    window.location.href = url + "?" + queryString;
  }
}
