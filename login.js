document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;
    const feedback = document.getElementById("login-feedback");

    // Fetch JSON data
    fetch("user.json")
      .then((response) => response.json())
      .then((users) => {
        const user = users.find(
          (user) => user.email === emailInput && user.password === passwordInput
        );

        if (user) {
          feedback.textContent = "Нэвтрэх амжилттай боллоо!";
          feedback.style.color = "green";
          // Store isLogging as true in localStorage
          localStorage.setItem("isLogging", true);
          localStorage.setItem("userName", user.username);
          // Redirect or perform actions on successful login
          window.location.href = "index.html";
        } else {
          feedback.textContent = "Имэйл эсвэл нууц үг буруу байна!";
          feedback.style.color = "red";
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        feedback.textContent = "Алдаа гарлаа, дахин оролдоно уу.";
        feedback.style.color = "red";
      });
  });
