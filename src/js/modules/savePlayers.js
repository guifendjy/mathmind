function User() {
  let userData;
  Object.defineProperty(this, "data", {
    get: () => userData,
    set: ({ username, avgScore }) => (userData = { username, avgScore }),
  });
}
// get users from ls
function getUsers() {
  // retrieving existing profiles to render(do on page load)
  const profilesData = JSON.parse(localStorage.getItem("profilesData"));
  return profilesData;
}
function getUserData({ username }) {
  let profiles = getUsers();
  let newProfiles = [...profiles];
  const index = newProfiles.findIndex((obj) => obj.username == username);
  if (index != -1) {
    return newProfiles[index];
  }
}
function createUserProfile({ username, avgScore }) {
  // creating and saving userProfile
  // could later implement the AvgScore(by giving option to leave game and go back to index);
  const profile = JSON.parse(localStorage.getItem("profilesData")) || [];
  let userData = { username, avgScore };
  let newUser = new User();
  newUser.data = userData;
  profile.push(newUser.data);
  // store updated arr
  localStorage.profilesData = JSON.stringify(profile);
}

function deleteUserProfile({ username }) {
  let profiles = getUsers();
  let newProfiles = [...profiles];
  const index = newProfiles.findIndex((obj) => obj.username == username);
  if (index != -1) {
    newProfiles.splice(index, 1);
    // replace whole data arr inside ls
    localStorage.profilesData = JSON.stringify(newProfiles);
  }
}

function updateUserProfile({ username, avgScore }) {
  let profiles = getUsers();
  let newProfiles = [...profiles];
  const index = newProfiles.findIndex((obj) => obj.username == username);
  // updates arr(replace userdata by new data)
  newProfiles[index] = { username, avgScore };
  // replace whole data arr inside ls
  localStorage.profilesData = JSON.stringify(newProfiles);
}

export {
  getUsers,
  getUserData,
  createUserProfile,
  deleteUserProfile,
  updateUserProfile,
};
