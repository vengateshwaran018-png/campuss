// Campus Bot - talks like a friend. It does not care about capital or small letters.
// Edit the answers with your real college details.

var faq = [
  { words: ["college time", "college timing", "college hours", "working hours", "what time does college", "when does college", "college start", "college end", "college close", "college open"],
    answer: ["Our college runs from 9:00 AM to 4:20 PM, with 8 periods in between.", "Classes start at 9:00 AM and the day ends at 4:20 PM."] },
  { words: ["library", "book"],
    answer: ["You can see which books are available on the Library page and reserve them there. Then just collect from the library.", "Need a book? Open the Library page, reserve it, and pick it up later."] },
  { words: ["bus", "transport", "route"],
    answer: ["Buses reach the college around 8:40 AM, before the 9 AM start, and leave at 4:30 PM after college ends. Full routes are on the Transport page."] },
  { words: ["attendance", "present", "absent", "75"],
    answer: ["Attendance is marked period by period with the camera scan on the Attendance page. Try to keep it above 75%, my friend!"] },
  { words: ["event", "symposium", "fest", "function"],
    answer: ["All the upcoming events with dates are on the Events page and on your dashboard."] },
  { words: ["notes", "video", "youtube", "learn", "study", "subject"],
    answer: ["Open AI Learning, pick your department, and you get notes and videos for every subject."] },
  { words: ["department", "cse", "ece", "mech", "eee", "civil", "block", "where is the"],
    answer: ["Check the Campus Map page, it shows where each department block, the canteen and the library are."] },
  { words: ["sos", "emergency", "help me", "danger"],
    answer: ["In an emergency press the red SOS button. It sends your location to your emergency contacts. Stay safe!"] },
  { words: ["address", "where is", "location", "located"],
    answer: ["We are at A.S. Nagar, Elupatti, Rawasapatti (PO), Thanjavur - 613403, near the Thanjavur Air Force Station. The Campus Map page has a Google Maps link."] },
  { words: ["phone", "contact", "number", "email", "mail"],
    answer: ["Phone: 04362 - 282465. Email: sjcet.tnj@gmail.com."] },
  { words: ["website", "web site"],
    answer: ["Our website is www.sjcettnj.edu.in"] },
  { words: ["about", "established", "affiliat", "anna university", "naac", "aicte"],
    answer: ["St. Joseph's College of Engineering and Technology started in 2007. It is on a 15 acre campus, affiliated to Anna University and approved by AICTE."] },
  { words: ["reach", "railway", "airport", "how to come"],
    answer: ["The campus is about 7.5 km from Thanjavur Bus Stand and about 11.7 km from the railway station. Use the Google Maps link on the Campus Map page."] },
  { words: ["hostel"],
    answer: ["Yes, the college has hostel facilities. Call the office on 04362 - 282465 for room and fee details."] },
  { words: ["course", "programme", "degree"],
    answer: ["The college offers B.E., M.E. and MBA programmes."] }
];

var chatBtn = document.getElementById("chat-btn");
var chatBox = document.getElementById("chat-box");
var chatMsgs = document.getElementById("chat-msgs");
var chatInput = document.getElementById("chat-input");

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getName() {
  var profile = JSON.parse(localStorage.getItem("profile_" + currentEmail) || "{}");
  return profile.name ? profile.name.split(" ")[0] : "friend";
}

function addMessage(text, who) {
  var div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  chatMsgs.appendChild(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function getAnswer(question) {
  // small and capital letters are the same, symbols are removed
  var q = question.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  var name = getName();

  if (/^(hi+|hello+|hey+|hai|vanakkam)( |$)/.test(q)) {
    return pick(["Hey " + name + "! Good to see you. What do you want to know?", "Hi " + name + "! How can I help you today?"]);
  }
  if (q.indexOf("how are you") != -1 || q.indexOf("how r u") != -1) {
    return "I'm doing great, thanks for asking! How about you, " + name + "?";
  }
  if (q.indexOf("good morning") != -1) return "Good morning " + name + "! Have a great day at college.";
  if (q.indexOf("good afternoon") != -1) return "Good afternoon " + name + "! Hope your classes are going well.";
  if (q.indexOf("good evening") != -1) return "Good evening " + name + "! How was your day?";
  if (q.indexOf("good night") != -1) return "Good night " + name + "! Sleep well and see you tomorrow.";
  if (q.indexOf("thank") != -1 || q == "ok thanks" || q == "tq") return pick(["Anytime, friend!", "No problem at all, happy to help!"]);
  if (q.indexOf("bye") != -1) return "Bye " + name + "! Take care, see you soon.";
  if (q.indexOf("your name") != -1 || q.indexOf("who are you") != -1) {
    return "I'm Campus Bot, your friend at St. Joseph's College. Ask me anything about the campus!";
  }
  if (q.indexOf("love you") != -1 || q.indexOf("best friend") != -1) return "Aww, you're my favourite student too, " + name + "!";

  // canteen questions use the real menu from data.js
  if (/\b(canteen|food|lunch|hungry|snacks?|menu|dosa|parotta|rice|noodles?|puffs?|bajji|juice|biscuits?|chips)\b/.test(q)) {
    var items = [];
    for (var m = 0; m < menu.length; m++) items.push(menu[m].name + " Rs." + menu[m].price);
    return "Hungry? Here is what the canteen has: " + items.join(", ") + ".";
  }

  // holiday questions use the list from data.js
  if (/\b(holidays?|leave)\b/.test(q)) {
    var next = null;
    var todayText = new Date().toISOString().slice(0, 10);
    for (var h = 0; h < allEvents.length; h++) {
      var e = allEvents[h];
      if (e.type == "Holiday" && e.date >= todayText && (next == null || e.date < next.date)) next = e;
    }
    if (next == null) return "I don't see any upcoming holiday in my list yet. Check the Events page.";
    return "The next holiday is " + next.name + " on " + niceDate(next.date) + ". All upcoming holidays are on the Events page.";
  }

  for (var i = 0; i < faq.length; i++) {
    for (var j = 0; j < faq[i].words.length; j++) {
      if (q.indexOf(faq[i].words[j]) != -1) {
        return pick(faq[i].answer);
      }
    }
  }
  return "Hmm, I don't know that one yet, " + name + ". You can ask me about buses, canteen, library, events, attendance or the campus, or call the office on 04362 - 282465.";
}

chatBtn.onclick = function () {
  chatBox.classList.toggle("hidden");
  if (chatMsgs.children.length == 0) {
    addMessage("Hey " + getName() + "! I'm Campus Bot, your college friend. Ask me anything!", "bot");
  }
};

document.getElementById("chat-form").onsubmit = function (e) {
  e.preventDefault();
  var q = chatInput.value.trim();
  if (q == "") return;
  addMessage(q, "me");
  chatInput.value = "";
  addMessage(getAnswer(q), "bot");
};
