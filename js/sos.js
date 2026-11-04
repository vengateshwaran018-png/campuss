// SOS button: gets the location, sends an email (EmailJS) and shows
// WhatsApp, SMS and Call buttons for the alternative number.
var sosBtn = document.getElementById("sos-btn");

// make a phone number like +919876543210 (adds +91 if only 10 digits are typed)
function fixNumber(num) {
  var digits = (num || "").replace(/[^0-9]/g, "");
  if (digits.length == 10) digits = "91" + digits;
  return digits;
}

function showSosPanel(profile, message) {
  var old = document.getElementById("sos-panel");
  if (old) old.remove();

  var number = fixNumber(profile.altPhone);
  var text = encodeURIComponent(message);
  var panel = document.createElement("div");
  panel.id = "sos-panel";

  var html = "<h3>SOS alert</h3>";
  if (number == "") {
    html += "<p>No alternative number saved. Register again with an alternative phone number.</p>";
  } else {
    html += "<p>Tap a button to alert " + profile.altPhone + "</p>" +
      "<a class='sos-link green-bg' target='_blank' href='https://wa.me/" + number + "?text=" + text + "'>Send WhatsApp message</a>" +
      "<a class='sos-link blue-bg' href='sms:+" + number + "?&body=" + text + "'>Send SMS</a>" +
      "<a class='sos-link red-bg' href='tel:+" + number + "'>Call now</a>";
  }
  html += "<button id='sos-close'>Close</button>";
  panel.innerHTML = html;
  document.body.appendChild(panel);
  document.getElementById("sos-close").onclick = function () { panel.remove(); };
}

function sendSOS(lat, lon) {
  var profile = JSON.parse(localStorage.getItem("profile_" + currentEmail) || "{}");
  var name = profile.name || currentEmail;
  var mapLink = lat == "unknown" ? "location not available" : "https://www.google.com/maps?q=" + lat + "," + lon;
  var message = "EMERGENCY! " + name + " needs help. Location: " + mapLink;

  // WhatsApp / SMS / Call buttons (works even without any keys)
  showSosPanel(profile, message);

  // email through EmailJS, only if the keys are filled in js/config.js
  if (emailjsConfig.publicKey == "YOUR_EMAILJS_PUBLIC_KEY") return;

  emailjs.init(emailjsConfig.publicKey);
  // the EmailJS template should use: to_email, student_name, student_phone, location
  var data = {
    to_email: profile.altEmail || currentEmail,
    student_name: name,
    student_phone: profile.phone || "",
    location: mapLink
  };
  emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, data)
    .then(function () { console.log("SOS email sent"); })
    .catch(function () { alert("Could not send the SOS email."); });
}

sosBtn.onclick = function () {
  if (!confirm("Send an emergency alert to your contacts?")) return;

  if (!navigator.geolocation) {
    sendSOS("unknown", "unknown");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    function (pos) { sendSOS(pos.coords.latitude, pos.coords.longitude); },
    function () { sendSOS("unknown", "unknown"); }
  );
};
