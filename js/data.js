// All the college data is here. Change it to your real data.

var subjectsByDept = {
  "1st Year (Common)": ["Matrices and Calculus", "Engineering Physics", "Engineering Chemistry", "Problem Solving and Python Programming", "Engineering Graphics", "Technical English", "Probability and Statistics", "Basic Electrical and Electronics Engineering", "Engineering Mechanics", "Environmental Science"],
  "CSE": ["Discrete Mathematics", "Data Structures", "Digital Principles and Computer Organization", "Object Oriented Programming", "Database Management Systems", "Operating Systems", "Design and Analysis of Algorithms", "Computer Networks", "Theory of Computation", "Software Engineering", "Compiler Design", "Artificial Intelligence", "Web Technology", "Cloud Computing", "Cryptography and Network Security", "Machine Learning"],
  "AI and DS": ["Python Programming", "Data Structures Design", "Probability and Statistics", "Fundamentals of Data Science and Analytics", "Database Management Systems", "Artificial Intelligence", "Machine Learning", "Deep Learning", "Big Data Analytics", "Natural Language Processing", "Data Visualization", "Exploratory Data Analysis", "Computer Vision", "Cloud Computing"],
  "IT": ["Data Structures", "Database Management Systems", "Operating Systems", "Computer Networks", "Web Technology", "Software Engineering", "Cloud Computing", "Information Security", "Mobile Application Development", "Internet of Things"],
  "ECE": ["Circuit Analysis", "Electronic Devices and Circuits", "Signals and Systems", "Digital Electronics", "Linear Integrated Circuits", "Analog Communication", "Digital Signal Processing", "Digital Communication", "Microprocessors and Microcontrollers", "Transmission Lines and Waveguides", "VLSI Design", "Embedded Systems", "Wireless Communication", "Antenna and Wave Propagation"],
  "EEE": ["Circuit Theory", "Electromagnetic Fields", "Electrical Machines I", "Electrical Machines II", "Transmission and Distribution", "Power System Analysis", "Control Systems", "Power Electronics", "Microprocessors and Microcontrollers", "Measurements and Instrumentation", "Protection and Switchgear", "Renewable Energy Systems"],
  "Mechanical": ["Engineering Thermodynamics", "Fluid Mechanics and Machinery", "Strength of Materials", "Manufacturing Technology", "Kinematics of Machinery", "Dynamics of Machinery", "Heat and Mass Transfer", "Design of Machine Elements", "CAD CAM", "Metrology and Measurements", "Thermal Engineering", "Automobile Engineering", "Mechatronics"],
  "Civil": ["Surveying", "Strength of Materials", "Fluid Mechanics", "Structural Analysis", "Concrete Technology", "Soil Mechanics", "Design of Reinforced Concrete Elements", "Hydrology", "Environmental Engineering", "Transportation Engineering", "Estimation and Costing", "Foundation Engineering"]
};

// College time: 9:00 AM to 4:20 PM. Buses reach before 9 and leave after 4:20.
// These routes are sample data, change them to your real routes.
var buses = [
  { route: "Route 1", path: "Thanjavur Bus Stand - Medical College - College", start: "7:45 AM", reach: "8:40 AM", leave: "4:30 PM" },
  { route: "Route 2", path: "Orathanadu - Vallam - College", start: "7:30 AM", reach: "8:35 AM", leave: "4:30 PM" },
  { route: "Route 3", path: "Kumbakonam - Papanasam - College", start: "7:15 AM", reach: "8:40 AM", leave: "4:30 PM" },
  { route: "Route 4", path: "Pudukkottai - Pillaiyarpatti - College", start: "7:20 AM", reach: "8:40 AM", leave: "4:30 PM" }
];

var menu = [
  { name: "Dosa", price: 25 },
  { name: "Veg Puff", price: 15 },
  { name: "Egg Puff", price: 17 },
  { name: "Bajji", price: 7 },
  { name: "Parotta", price: 10 },
  { name: "Chicken Fried Rice", price: 100 },
  { name: "Chicken Noodles", price: 100 },
  { name: "Egg Rice", price: 50 },
  { name: "Bottle Juice", price: 10 },
  { name: "Biscuits", price: 10 },
  { name: "Chips", price: 10 }
];

var books = [
  { title: "Data Structures Using C", author: "Reema Thareja", copies: 4 },
  { title: "Database System Concepts", author: "Silberschatz", copies: 2 },
  { title: "Operating System Concepts", author: "Galvin", copies: 0 },
  { title: "Computer Networks", author: "Tanenbaum", copies: 3 },
  { title: "Strength of Materials", author: "R.K. Bansal", copies: 0 },
  { title: "Electric Machinery", author: "Fitzgerald", copies: 1 }
];

// 8 periods between 9:00 AM and 4:20 PM (with tea and lunch breaks). Change if your timetable is different.
var periods = [
  "9:00 AM - 9:45 AM", "9:45 AM - 10:30 AM",
  "10:45 AM - 11:30 AM", "11:30 AM - 12:15 PM",
  "1:00 PM - 1:45 PM", "1:45 PM - 2:30 PM",
  "2:45 PM - 3:30 PM", "3:30 PM - 4:20 PM"
];

// true = the Scan button marks the next free period (good for testing anytime)
// false = it marks only the period that is running right now
var testMode = true;

var subjectAttendance = [
  { name: "Data Structures", percent: 88 },
  { name: "Database Management", percent: 76 },
  { name: "Operating Systems", percent: 91 },
  { name: "Computer Networks", percent: 68 },
  { name: "Web Technology", percent: 95 }
];

// College details (address, phone, website from the college's public listings)
var collegeInfo = {
  name: "St. Joseph's College of Engineering and Technology",
  address: "A.S. Nagar, Elupatti, Rawasapatti (PO), Thanjavur - 613403, Tamil Nadu",
  phone: "04362 - 282465",
  email: "sjcet.tnj@gmail.com",
  website: "https://www.sjcettnj.edu.in"
};

// IMPORTANT: this is only an approximate position near Elupatti, Thanjavur.
// Open the college in Google Maps, right click on the main gate, click the numbers
// to copy them, and paste them here.
var collegeLat = 10.7250;
var collegeLng = 79.1000;

// The building positions are also guesses around the main gate.
// Move each one by changing its lat/lng after you walk around or check satellite view.
var places = [
  { name: "Main Gate", lat: collegeLat, lng: collegeLng },
  { name: "Administrative Block / Principal Office", lat: collegeLat + 0.0006, lng: collegeLng + 0.0002 },
  { name: "CSE, AI and DS, IT Block", lat: collegeLat + 0.0010, lng: collegeLng + 0.0008 },
  { name: "ECE and EEE Block", lat: collegeLat + 0.0012, lng: collegeLng - 0.0005 },
  { name: "Mechanical and Civil Block", lat: collegeLat + 0.0003, lng: collegeLng + 0.0012 },
  { name: "Science and Humanities Block", lat: collegeLat + 0.0008, lng: collegeLng - 0.0011 },
  { name: "Library", lat: collegeLat + 0.0007, lng: collegeLng - 0.0003 },
  { name: "Canteen", lat: collegeLat + 0.0004, lng: collegeLng - 0.0008 },
  { name: "Hostel", lat: collegeLat - 0.0006, lng: collegeLng + 0.0010 },
  { name: "Playground", lat: collegeLat - 0.0008, lng: collegeLng - 0.0006 },
  { name: "Auditorium", lat: collegeLat + 0.0014, lng: collegeLng + 0.0002 }
];


// Dates are written as year-month-day.
// College events: these three are sample events, replace them with your real ones.
// Holidays: Tamil Nadu government holidays. Add the new year's Tamil Nadu list (Pongal etc.)
// here when the government announces it.
var allEvents = [
  { date: "2026-11-15", name: "Technical Symposium", type: "Event" },
  { date: "2026-11-28", name: "Placement Training Workshop", type: "Event" },
  { date: "2026-12-10", name: "Annual Sports Meet", type: "Event" },
  { date: "2026-11-08", name: "Deepavali", type: "Holiday" },
  { date: "2026-12-25", name: "Christmas", type: "Holiday" },
  { date: "2027-01-01", name: "New Year's Day", type: "Holiday" },
  { date: "2027-01-26", name: "Republic Day", type: "Holiday" }
];
