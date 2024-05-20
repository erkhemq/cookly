// Foods fetching
fetch("foods.json")
  .then((response) => response.json())
  .then((foods) => {
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

      foodsWrapper.appendChild(foodArticle);
    }
    // Object.entries(data).forEach(([{ id, name, number }]) => {
    //   createFoodWrapper(id, name, number);
    // });
    foods.forEach((food) => {
      createFoodWrapper(food.id, food.name, food.ingredients.length);
    });
  })
  .catch((error) => console.error("Error fetching the food data:", error));
