var currentEmail = "";


function showPage(email) {
  currentEmail = email;
  var profile = JSON.parse(localStorage.getItem("profile_" + email) || "{}");
  var name = profile.name || email;
  document.getElementById("welcome").textContent = "Welcome, " + name;

}

// only logged in users can see this page
if (demoMode) {
  var user = localStorage.getItem("demoUser");
  if (!user) { window.location = "index.html"; }
  else { showPage(user); }
} else {
  firebase.auth().onAuthStateChanged(function (u) {
    if (!u) { window.location = "index.html"; }
    else { showPage(u.email); }
  });
}

document.getElementById("logout-btn").onclick = function () {
  if (demoMode) {
    localStorage.removeItem("demoUser");
    window.location = "index.html";
  } else {
    firebase.auth().signOut().then(function () { window.location = "index.html"; });
  }
};
