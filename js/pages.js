// Sidebar page switching and all the inner pages

var today = new Date().toISOString().slice(0, 10);
var maps = {};

// ---------- switching pages ----------
function showSection(name) {
  var pages = document.querySelectorAll(".page");
  for (var i = 0; i < pages.length; i++) pages[i].classList.add("hidden");
  document.getElementById("page-" + name).classList.remove("hidden");

  var links = document.querySelectorAll("#sidebar a");
  for (var j = 0; j < links.length; j++) {
    links[j].classList.toggle("active", links[j].getAttribute("data-page") == name);
  }

  if (name == "transport") makeBusMap();
  if (name == "map") makeCampusMap();
  if (name == "library") showLibrary();
  if (name == "attendance") showAttendance();
  if (name == "analytics") showAnalytics();
}

document.getElementById("sidebar").onclick = function (e) {
  var page = e.target.getAttribute("data-page");
  if (page) {
    e.preventDefault();
    showSection(page);
  }
};

// ---------- AI Learning ----------
var deptSelect = document.getElementById("dept-select");
for (var d in subjectsByDept) {
  var opt = document.createElement("option");
  opt.value = d;
  opt.textContent = d;
  deptSelect.appendChild(opt);
}

function showSubjects() {
  var list = subjectsByDept[deptSelect.value];
  var search = document.getElementById("subject-search").value.toLowerCase();
  var html = "<tr><th>Subject</th><th>Notes</th><th>Videos</th></tr>";
  for (var i = 0; i < list.length; i++) {
    if (list[i].toLowerCase().indexOf(search) == -1) continue;
    var q = encodeURIComponent(list[i]);
    html += "<tr><td>" + list[i] + "</td>" +
      "<td><a target='_blank' href='https://www.google.com/search?q=" + q + "+notes+pdf'>Open notes</a></td>" +
      "<td><a target='_blank' href='https://www.youtube.com/results?search_query=4G+Silver+Academy+" + q + "'>Watch videos</a></td></tr>";
  }
  document.getElementById("subject-table").innerHTML = html;
}
deptSelect.onchange = showSubjects;
document.getElementById("subject-search").oninput = showSubjects;
showSubjects();

// ---------- Transport ----------
// time helper: "4:30 PM" -> minutes from midnight
function toMinutes(t) {
  var parts = t.split(" ");
  var hm = parts[0].split(":");
  var h = parseInt(hm[0]) % 12;
  if (parts[1] == "PM") h += 12;
  return h * 60 + parseInt(hm[1]);
}

var html = "<tr><th>Route</th><th>Places</th><th>Leaves first stop</th><th>Reaches college</th><th>Leaves college</th></tr>";
for (var i = 0; i < buses.length; i++) {
  html += "<tr><td>" + buses[i].route + "</td><td>" + buses[i].path + "</td><td>" + buses[i].start +
    "</td><td>" + buses[i].reach + "</td><td>" + buses[i].leave + "</td></tr>";
}
document.getElementById("bus-table").innerHTML = html;

// next bus card on the dashboard
function showNextBus() {
  var now = new Date();
  var nowMin = now.getHours() * 60 + now.getMinutes();
  var best = null;
  for (var i = 0; i < buses.length; i++) {
    var options = [
      { time: buses[i].start, text: buses[i].route + " leaves its first stop" },
      { time: buses[i].leave, text: buses[i].route + " leaves college" }
    ];
    for (var j = 0; j < options.length; j++) {
      var m = toMinutes(options[j].time);
      if (m > nowMin && (best == null || m < best.m)) best = { m: m, time: options[j].time, text: options[j].text };
    }
  }
  if (best == null) {
    best = { time: buses[0].start, text: "Tomorrow - " + buses[0].route + " leaves its first stop" };
  }
  document.getElementById("dash-bus").textContent = best.time;
  document.getElementById("dash-bus-small").textContent = best.text;
}
showNextBus();

function makeMap(id, zoom) {
  if (maps[id]) {
    maps[id].invalidateSize();
    return null;
  }
  maps[id] = L.map(id).setView([collegeLat, collegeLng], zoom);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(maps[id]);
  return maps[id];
}

function makeBusMap() {
  var m = makeMap("bus-map", 14);
  if (m) {
    L.marker([collegeLat + 0.004, collegeLng - 0.006]).addTo(m).bindPopup("Route 1 bus (sample position)").openPopup();
    L.marker([collegeLat, collegeLng]).addTo(m).bindPopup("College");
  }
}

// ---------- Dining ----------
html = "<tr><th>Item</th><th>Price</th></tr>";
for (var i = 0; i < menu.length; i++) {
  html += "<tr><td>" + menu[i].name + "</td><td>Rs. " + menu[i].price + "</td></tr>";
}
document.getElementById("menu-table").innerHTML = html;

// ---------- Library ----------
var reservedKey = "reserved_" + (typeof currentEmail != "undefined" && currentEmail ? currentEmail : "user");
function getReserved() { return JSON.parse(localStorage.getItem(reservedKey) || "[]"); }

function showLibrary() {
  var reserved = getReserved();
  var h = "<tr><th>Book</th><th>Author</th><th>Status</th><th></th></tr>";
  for (var i = 0; i < books.length; i++) {
    var b = books[i];
    var isReserved = reserved.indexOf(b.title) != -1;
    var status = b.copies > 0 ? "<span class='green'>Available (" + b.copies + ")</span>" : "<span class='red'>Not available</span>";
    var button = "";
    if (isReserved) button = "Reserved";
    else if (b.copies > 0) button = "<button class='small-btn' onclick='reserveBook(" + i + ")'>Reserve</button>";
    h += "<tr><td>" + b.title + "</td><td>" + b.author + "</td><td>" + status + "</td><td>" + button + "</td></tr>";
  }
  document.getElementById("book-table").innerHTML = h;

  var ul = document.getElementById("my-books");
  ul.innerHTML = reserved.length == 0 ? "<li>No books reserved yet</li>" : "";
  for (var k = 0; k < reserved.length; k++) {
    ul.innerHTML += "<li>" + reserved[k] + " - collect from the library</li>";
  }
  document.getElementById("dash-lib").textContent = reserved.length + " books";
}

function reserveBook(i) {
  var reserved = getReserved();
  reserved.push(books[i].title);
  localStorage.setItem(reservedKey, JSON.stringify(reserved));
  books[i].copies = books[i].copies - 1;
  showLibrary();
}

// ---------- Attendance ----------
var attKey = "att_" + today;
function getAtt() { return JSON.parse(localStorage.getItem(attKey) || "[]"); }

function showAttendance() {
  var att = getAtt();
  var h = "<tr><th>Period</th><th>Time</th><th>Status</th></tr>";
  for (var i = 0; i < periods.length; i++) {
    var present = att.indexOf(i) != -1;
    h += "<tr><td>" + (i + 1) + "</td><td>" + periods[i] + "</td><td>" +
      (present ? "<span class='green'>Present</span>" : "Not marked") + "</td></tr>";
  }
  document.getElementById("att-table").innerHTML = h;
  document.getElementById("dash-att").textContent = att.length + " / 8";
}

var camStream = null;
var modelsLoaded = false;
var faceStatus = document.getElementById("face-status");
var modelUrl = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/";

function setStatus(text, color) {
  faceStatus.textContent = text;
  faceStatus.style.color = color || "#666";
}

// returns true only if a face is found in the camera picture
function faceFound() {
  var video = document.getElementById("cam");
  var options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
  return faceapi.detectSingleFace(video, options).then(function (result) {
    return result != null;
  });
}

document.getElementById("cam-start").onclick = function () {
  setStatus("Loading face detector, please wait...");
  faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl)
    .then(function () {
      modelsLoaded = true;
      return navigator.mediaDevices.getUserMedia({ video: true });
    })
    .then(function (stream) {
      camStream = stream;
      var video = document.getElementById("cam");
      video.srcObject = stream;
      video.classList.remove("hidden");
      setStatus("Camera is on. Look at the camera and press Scan.");
    })
    .catch(function () {
      setStatus("Could not start. Check the internet and allow camera access.", "#c0392b");
    });
};

function markPeriod() {
  var att = getAtt();
  var index = -1;

  if (testMode) {
    for (var i = 0; i < periods.length; i++) {
      if (att.indexOf(i) == -1) { index = i; break; }
    }
  } else {
    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    for (var k = 0; k < periods.length; k++) {
      var range = periods[k].split(" - ");
      if (nowMin >= toMinutes(range[0]) && nowMin < toMinutes(range[1])) { index = k; break; }
    }
    if (index == -1) { setStatus("No class is running right now.", "#c0392b"); return; }
    if (att.indexOf(index) != -1) { setStatus("This period is already marked.", "#1e8449"); return; }
  }

  if (index == -1) { setStatus("All 8 periods are already marked.", "#1e8449"); return; }
  att.push(index);
  localStorage.setItem(attKey, JSON.stringify(att));
  showAttendance();
  setStatus("Face detected. Attendance marked for period " + (index + 1) + ".", "#1e8449");
}

document.getElementById("cam-scan").onclick = function () {
  if (!camStream || !modelsLoaded) { setStatus("Start the camera first.", "#c0392b"); return; }
  setStatus("Scanning...");
  var tries = 0;
  var hits = 0;

  // look 5 times, a face must be seen at least 3 times
  function look() {
    faceFound().then(function (found) {
      tries++;
      if (found) hits++;
      if (tries < 5) {
        setTimeout(look, 300);
      } else if (hits >= 3) {
        markPeriod();
      } else {
        setStatus("No face detected. Attendance NOT marked. Face the camera in good light.", "#c0392b");
      }
    });
  }
  look();
};

// ---------- Analytics ----------
function showAnalytics() {
  var h = "";
  for (var i = 0; i < subjectAttendance.length; i++) {
    var s = subjectAttendance[i];
    h += "<div class='bar-row'><div class='name'>" + s.name + "</div>" +
      "<div class='bar-bg'><div class='bar" + (s.percent < 75 ? " low" : "") + "' style='width:" + s.percent + "%'></div></div>" +
      "<div class='val'>" + s.percent + "%</div></div>";
  }
  h += "<p class='note'>Red bar means below 75%.</p>";
  document.getElementById("bars").innerHTML = h;
}

// ---------- Events and holidays ----------
function niceDate(iso) {
  var date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// only future dates, nearest first
function getUpcoming() {
  var list = [];
  for (var i = 0; i < allEvents.length; i++) {
    if (allEvents[i].date >= today) list.push(allEvents[i]);
  }
  list.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  return list;
}

function showEvents() {
  var list = getUpcoming();

  var h = "<tr><th>Date</th><th>Name</th><th>Type</th></tr>";
  for (var i = 0; i < list.length; i++) {
    var cls = list[i].type == "Holiday" ? "red" : "green";
    h += "<tr><td>" + niceDate(list[i].date) + "</td><td>" + list[i].name + "</td><td class='" + cls + "'>" + list[i].type + "</td></tr>";
  }
  document.getElementById("event-table").innerHTML = h;

  var ul = document.getElementById("event-list");
  ul.innerHTML = "";
  for (var k = 0; k < list.length && k < 5; k++) {
    ul.innerHTML += "<li>" + niceDate(list[k].date) + " - " + list[k].name + (list[k].type == "Holiday" ? " (Holiday)" : "") + "</li>";
  }
}
showEvents();

// canteen card on the dashboard
document.getElementById("dash-food").textContent = menu[0].name;
document.getElementById("dash-food-price").textContent = "Rs. " + menu[0].price;

// ---------- Campus Map ----------
document.getElementById("college-info").innerHTML =
  "<h3>About the college</h3>" +
  "<ul><li>" + collegeInfo.name + ", Thanjavur</li>" +
  "<li>Address: " + collegeInfo.address + "</li>" +
  "<li>Phone: " + collegeInfo.phone + "</li>" +
  "<li>Email: " + collegeInfo.email + "</li>" +
  "<li>Website: <a target='_blank' href='" + collegeInfo.website + "'>" + collegeInfo.website + "</a></li></ul>";

var directionsLink = "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(collegeInfo.name + " Elupatti Thanjavur");
document.getElementById("map-note").innerHTML =
  "Click a marker to see the place. Building positions are approximate. " +
  "<a target='_blank' href='" + directionsLink + "'>Open the college in Google Maps</a>";

function makeCampusMap() {
  var m = makeMap("campus-map", 17);
  if (m) {
    for (var i = 0; i < places.length; i++) {
      L.marker([places[i].lat, places[i].lng]).addTo(m).bindPopup(places[i].name);
    }
  }
}

showAttendance();
showLibrary();
