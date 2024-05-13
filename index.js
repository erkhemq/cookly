// document.addEventListener("DOMContentLoaded", function () {
//   var lis = document.querySelectorAll(".type-bottom li");
//   lis.forEach(function (li) {
//     li.addEventListener("click", function () {
//       if (this.style.backgroundColor != "#93C759")
//         this.style.backgroundColor = "#93C759";
//       else this.style.backgroundColor = "red";
//     });
//   });
// });

//jsonbin

//Drawer
document.addEventListener("DOMContentLoaded", function () {
  // Get all the each-food elements
  const eachFoodItems = document.querySelectorAll(".each-food");

  // Get the drawer element
  const drawer = document.querySelector(".detail-wrapper");

  const exitIcon = document.querySelector(".exit-icon");

  exitIcon.addEventListener("click", function () {
    drawer.classList.remove("show-drawer");
    drawerToggle.checked = false;
  });

  // Loop through each each-food item
  eachFoodItems.forEach((item) => {
    // Add click event listener to each each-food item
    item.addEventListener("click", () => {
      // Toggle the class that controls visibility of the drawer
      drawer.classList.toggle("show-drawer");
    });
  });
});
