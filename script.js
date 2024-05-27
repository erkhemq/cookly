document.addEventListener("DOMContentLoaded", async function () {
  const isLogging = localStorage.getItem("isLogging") === "true";

  // Get login and signup links
  const loginLink = document.getElementById("login-link");

  const profileImg = document.getElementById("profile-img");
  const dropdownContent = document.getElementById("dropdown-content");

  if (isLogging) {
    loginLink.style.display = "none";
  } else {
    // If the user is not logged in, show the login and signup links
    loginLink.style.display = "block";
    profileImg.style.display = "none";
  }

  // Function to toggle dropdown visibility
  function toggleDropdown() {
    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
  }

  // Event listener for profile image click
  profileImg.addEventListener("click", toggleDropdown);

  const userName = localStorage.getItem("userName");
  if (userName) {
    document.getElementById("user-name").textContent = userName;
  }

  const logoutBtn = document.getElementById("logout-btn");

  // Function to handle logout
  function handleLogout() {
    localStorage.clear();
    window.location.href = "signin.html";
  }

  // Event listener for logout button click
  logoutBtn.addEventListener("click", handleLogout);
});
