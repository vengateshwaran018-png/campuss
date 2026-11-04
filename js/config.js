// Put your own keys here (see README.txt)
var firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  appId: "YOUR_APP_ID"
};

var emailjsConfig = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID"
};

// true until you put real Firebase keys. Lets you try the pages without login setup.
var demoMode = firebaseConfig.apiKey === "YOUR_API_KEY";
if (!demoMode) {
  firebase.initializeApp(firebaseConfig);
}
