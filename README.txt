SMART CAMPUS - St. Joseph College of Engineering and Technology, Thanjavur

HOW TO RUN
1. Open the folder in VS Code and run index.html with the Live Server extension
   (Google login does not work if you just double click the file).
2. Without any keys it runs in demo mode: register, then login.

FIREBASE (real login + Google login)
1. console.firebase.google.com -> Add project
2. Build -> Authentication -> Get started -> enable Email/Password and Google
3. Project settings -> Your apps -> Web app (</>) -> copy the config values
4. Paste them in js/config.js (firebaseConfig)

EMAILJS (SOS email)
1. emailjs.com -> create account
2. Email Services -> Add service (Gmail) -> copy Service ID
3. Email Templates -> create template with {{to_email}}, {{student_name}},
   {{student_phone}}, {{location}} -> set "To email" field to {{to_email}} -> copy Template ID
4. Account -> copy Public Key
5. Paste all three in js/config.js (emailjsConfig)

CHANGE YOUR DATA
All bus timings, menu, books, subjects and map places are in js/data.js.
The map position is only approximate. Put your real college latitude/longitude there (right click your college on Google Maps to copy it).

NEXT STEPS
Real bus GPS tracking, real face recognition, saving data in Firebase.
