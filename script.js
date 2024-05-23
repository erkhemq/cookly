let foodsLength = 0;
let selectedIngreCount = 0;
let ingredients = [];

async function fetchIngredients() {
  try {
    const response = await fetch("ingredients.json");
    const data = await response.json();

    function createTypeWrapper(type, imgSrc, foods, name) {
      let selectedCount = 0;
      const ingreWrapper = document.querySelector(".ingre-wrapper");

      const article = document.createElement("article");
      article.classList.add("type-wrapper");

      const divTypeHeader = document.createElement("div");
      divTypeHeader.classList.add("type-header");

      const img = document.createElement("img");
      img.src = `./assets/${imgSrc}.svg`;
      img.width = 28;
      img.alt = type;

      const section = document.createElement("section");

      const h2 = document.createElement("h2");
      h2.textContent = name;
      const p = document.createElement("p");
      p.textContent = `${selectedCount}/${foods.length} найрлага`;

      const imgCaret = document.createElement("img");
      imgCaret.src = "./assets/caret.svg";
      imgCaret.width = 12;
      imgCaret.alt = "caret";
      imgCaret.classList.add("down-arrow");

      divTypeHeader.appendChild(img);
      section.appendChild(h2);
      section.appendChild(p);
      divTypeHeader.appendChild(section);
      divTypeHeader.appendChild(imgCaret);
      article.appendChild(divTypeHeader);

      const ul = document.createElement("ul");
      ul.classList.add("type-bottom");
      foods.forEach((food) => {
        const li = document.createElement("li");
        li.textContent = food.name;
        li.dataset.id = food.id;
        li.addEventListener("click", () => {
          if (li.classList.toggle("selected")) {
            selectedCount++;
            selectedIngreCount++;
            ingredients.push(food.id);
            console.log(`ingredients ${ingredients}`);
          } else {
            selectedCount--;
            selectedIngreCount--;
            const temp = ingredients.indexOf(food.id);
            if (index > -1) {
              ingredients.splice(temp, 1);
            }
            console.log(`ingredients ${ingredients}`);
          }
          showSelectedIngreCount(selectedIngreCount);
          p.textContent = `${selectedCount}/${foods.length} найрлага`;
        });
        ul.appendChild(li);
      });
      article.appendChild(ul);

      ingreWrapper.appendChild(article);
    }

    Object.entries(data).forEach(([type, { img, items, name }]) => {
      createTypeWrapper(type, img, items, name);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchFoods() {
  try {
    const response = await fetch("foods.json");
    const foods = await response.json();
    foodsLength = foods.length;
    const foodsWrapper = document.querySelector(".foods-wrapper");

    function createFoodWrapper(id, name, number) {
      const foodArticle = document.createElement("article");
      foodArticle.className = "each-food";

      const img = document.createElement("img");
      img.src = `./assets/food1.png`;
      img.width = 81;
      img.alt = `food${id}`;

      const foodDetails = document.createElement("div");
      foodDetails.className = "food-details";

      const foodTitle = document.createElement("h4");
      foodTitle.textContent = name;

      const foodIngredients = document.createElement("small");
      foodIngredients.textContent = `Танд бүх ${number} найрлага байна`;

      const interactDiv = document.createElement("div");
      interactDiv.className = "interact";

      const heartImg = document.createElement("img");
      heartImg.src = "./assets/heart.svg";
      heartImg.width = 14;
      heartImg.alt = "heart";

      const linkImg = document.createElement("img");
      linkImg.src = "./assets/link.svg";
      linkImg.width = 12;
      linkImg.alt = "link";

      interactDiv.appendChild(heartImg);
      interactDiv.appendChild(linkImg);

      foodDetails.appendChild(foodTitle);
      foodDetails.appendChild(foodIngredients);
      foodDetails.appendChild(interactDiv);

      foodArticle.appendChild(img);
      foodArticle.appendChild(foodDetails);

      foodArticle.addEventListener("click", () => {
        handleDrawerFunctionality(id);
      });

      foodsWrapper.appendChild(foodArticle);
    }

    foods.forEach((food) => {
      createFoodWrapper(food.id, food.name, food.ingredients.length);
    });
  } catch (error) {
    console.error("Error fetching the food data:", error);
  }
}

function handleIngredientClick() {
  const lis = document.querySelectorAll(".type-bottom li");
  lis.forEach((li) => {
    li.addEventListener("click", function () {
      li.classList.toggle("activeToggleButton"); // Toggle active class
      li.classList.toggle("disactiveToggleButton"); // Toggle inactive class
    });
  });
}

async function updateDetailSection(id) {
  try {
    const response = await fetch("foods.json");
    const foods = await response.json();
    const selectedFood = foods.find((food) => food.id === id);

    if (!selectedFood) return;

    const foodName = selectedFood.name;
    const foodIngredients = selectedFood.ingredients;
    const instructions = selectedFood.instructions;

    console.log(`first indtruction ${instructions[0].description}`);

    const foodCover = document.getElementById("food-cover");
    const foodNameElement = document.querySelector(".food-name h3");
    const foodSubnameElement = document.querySelector(".food-subname small");
    const ingredientList = document.querySelector(".detail-bottom-wrapper ol");
    const instructionList = document.querySelector(
      ".detail-bottom-wrapper .instructions"
    );

    // Update the food cover image
    foodCover.src = `./assets/food1.png`;

    // Update the food name
    foodNameElement.textContent = foodName;

    // Update the food subname (number of ingredients)
    foodSubnameElement.textContent = `Танд бүх ${foodIngredients.length} найрлага байна`;

    // Clear previous ingredient and instruction lists
    ingredientList.innerHTML = "";
    instructionList.innerHTML = "";

    // Populate the ingredient list
    foodIngredients.forEach((ingredient) => {
      const li = document.createElement("li");
      const p = document.createElement("p");
      p.textContent = ingredient;
      const img = document.createElement("img");
      img.src = "./assets/check.svg";
      img.alt = "check";
      li.appendChild(p);
      li.appendChild(img);
      ingredientList.appendChild(li);
    });

    // Populate the instruction list
    instructions.forEach((instruction, index) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = `Алхам ${instruction.step}: `;
      const p = document.createElement("p");
      p.textContent = instruction.description;
      li.appendChild(span);
      li.appendChild(p);
      instructionList.appendChild(li);
    });
  } catch (error) {
    console.error("Error updating the detail section:", error);
  }
}

function handleDrawerFunctionality(id) {
  const eachFoodItems = document.querySelectorAll(".each-food");
  const drawer = document.querySelector(".detail-wrapper");
  const exitIcon = document.querySelector(".exit-icon");

  exitIcon.addEventListener("click", function () {
    drawer.classList.remove("show-drawer");
  });

  eachFoodItems.forEach((item) => {
    item.addEventListener("click", () => {
      drawer.classList.toggle("show-drawer");
      updateDetailSection(id);
    });
  });
  updateDetailSection(id);
}

function showFoodsCount() {
  const foodCountText = document.querySelector(".food-count");
  foodCountText.textContent = `Та ${foodsLength} хоол хийх боломжтой`;
}

function showSelectedIngreCount() {
  const ingreCount = document.querySelector(".ingre-count");
  ingreCount.textContent = `Танд ${selectedIngreCount} орц байна`;
}

function toggleIngreArrow() {
  const arrows = document.querySelectorAll(".down-arrow");
  arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const ul = arrow.parentNode.nextSibling;
      ul.style.display = ul.style.display === "flex" ? "none" : "flex";
      ul.style.flexWrap = "wrap";
      ul.style.transition = "display 0.3s ease";
    });
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  await fetchIngredients();
  await fetchFoods();
  showFoodsCount(foodsLength);
  toggleIngreArrow();
  handleIngredientClick();
  handleDrawerFunctionality();
});
