var msg = document.getElementById("message");
var loginForm = document.getElementById("login-form");
var registerForm = document.getElementById("register-form");

function showMessage(text, good) {
  msg.textContent = text;
  msg.className = good ? "ok" : "";
}

// switch between login and register
document.getElementById("to-register").onclick = function () {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  showMessage("");
};
document.getElementById("to-login").onclick = function () {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  showMessage("");
};

// save the SOS contact details in the browser (later this can move to Firestore)
function saveProfile(email, name, phone, altPhone, altEmail) {
  var profile = { name: name, email: email, phone: phone, altPhone: altPhone, altEmail: altEmail };
  localStorage.setItem("profile_" + email, JSON.stringify(profile));
}

// register
document.getElementById("register-btn").onclick = function () {
  var name = document.getElementById("reg-name").value;
  var email = document.getElementById("reg-email").value;
  var password = document.getElementById("reg-password").value;
  var phone = document.getElementById("reg-phone").value;
  var altPhone = document.getElementById("reg-alt-phone").value;
  var altEmail = document.getElementById("reg-alt-email").value;

  if (name == "" || email == "" || password == "") {
    showMessage("Please fill name, email and password");
    return;
  }

  if (demoMode) {
    localStorage.setItem("demo_" + email, password);
    saveProfile(email, name, phone, altPhone, altEmail);
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    showMessage("Registered. Now login with your email and password.", true);
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
      saveProfile(email, name, phone, altPhone, altEmail);
      return firebase.auth().signOut(); // so the user has to login after registering
    })
    .then(function () {
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
      showMessage("Registered. Now login with your email and password.", true);
    })
    .catch(function (err) { showMessage(err.message); });
};

// login
document.getElementById("login-btn").onclick = function () {
  var email = document.getElementById("login-email").value;
  var password = document.getElementById("login-password").value;

  if (demoMode) {
    if (localStorage.getItem("demo_" + email) === password && password != "") {
      localStorage.setItem("demoUser", email);
      window.location = "dashboard.html";
    } else {
      showMessage("Wrong email or password (register first)");
    }
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () { window.location = "dashboard.html"; })
    .catch(function () { showMessage("Wrong email or password"); });
};

// google login
document.getElementById("google-btn").onclick = function () {
  if (demoMode) {
    showMessage("Google login works after you add Firebase keys in js/config.js");
    return;
  }
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(function () { window.location = "dashboard.html"; })
    .catch(function (err) { showMessage(err.message); });
};
