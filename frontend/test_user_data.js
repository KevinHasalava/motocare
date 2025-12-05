console.log("Checking localStorage user data...");
const userData = localStorage.getItem('user');
if (userData) {
  const user = JSON.parse(userData);
  console.log("User data:", user);
  console.log("User type:", user.userType);
  console.log("Has userType:", user.hasOwnProperty('userType'));
} else {
  console.log("No user data found in localStorage");
}
