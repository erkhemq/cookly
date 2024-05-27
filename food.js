import { getLikedFoods, setLikedFoods } from "./storage.js";

class MainWrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.foods = [];
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="style.css">
      <section class="main-wrapper">
        <article class="title-cookly">
          <h1>Cookly</h1>
          <h2 class="food-count">Та 0 хоол хийх боломжтой</h2>
        </article>
        <div class="search-wrapper">
          <img src="./assets/search.svg" class="search-icon" />
          <input type="text" placeholder="Хоол хайх" class="search" />
        </div>
        <section class="content-wrapper">
          <section class="foods-wrapper"></section>
        </section>
      </section>
    `;
  }

  connectedCallback() {
    this.fetchFoods();
    this.shadowRoot
      .querySelector(".search")
      .addEventListener("input", this.handleSearch.bind(this));

    // Listen for the custom 'like-toggled' event to update the likes
    document.addEventListener("like-toggled", (event) => {
      const { id, liked } = event.detail;
      this.updateLikeState(id, liked);
    });
  }

  async fetchFoods() {
    try {
      const response = await fetch("foods.json");
      const foods = await response.json();
      this.foods = foods.map((food) => ({
        ...food,
        liked: getLikedFoods()[food.id] || false,
      })); // Load liked state
      this.foodsLength = foods.length;
      this.updateFoodCount();
      this.renderFoods();
    } catch (error) {
      console.error("Error fetching the food data:", error);
    }
  }

  renderFoods() {
    const foodsWrapper = this.shadowRoot.querySelector(".foods-wrapper");
    foodsWrapper.innerHTML = "";
    this.foods.forEach((food) => {
      this.createFoodWrapper(
        food.id,
        food.name,
        food.ingredients.length,
        food.liked
      );
    });
  }

  createFoodWrapper(id, name, number, liked) {
    const foodsWrapper = this.shadowRoot.querySelector(".foods-wrapper");

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
    heartImg.src = liked ? "./assets/filled-heart.svg" : "./assets/heart.svg";
    heartImg.width = 14;
    heartImg.alt = "heart";
    heartImg.classList.add("heart-img");
    heartImg.dataset.id = id;

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
      const drawer = document.querySelector("drawer-section");
      if (drawer) {
        drawer.updateDetailSection(id);
      }
    });

    foodsWrapper.appendChild(foodArticle);

    heartImg.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleLike(id);
    });
  }

  toggleLike(id) {
    const food = this.foods.find((food) => food.id === id);
    if (food) {
      food.liked = !food.liked;
      setLikedFoods(this.foods);

      // Dispatch custom event
      const likeEvent = new CustomEvent("like-toggled", {
        detail: { id, liked: food.liked },
      });
      document.dispatchEvent(likeEvent);

      this.renderFoods();
    }
  }

  updateLikeState(id, liked) {
    const food = this.foods.find((food) => food.id === id);
    if (food) {
      food.liked = liked;
      this.renderFoods();
    }
  }

  updateFoodCount() {
    const foodCountText = this.shadowRoot.querySelector(".food-count");
    foodCountText.textContent = `Та ${this.foodsLength} хоол хийх боломжтой`;
  }

  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const foodArticles = this.shadowRoot.querySelectorAll(".each-food");
    let count = 0;
    foodArticles.forEach((foodArticle) => {
      const title = foodArticle.querySelector("h4").textContent.toLowerCase();
      if (title.includes(searchTerm)) {
        foodArticle.style.display = "flex"; // Ensure display is set to flex
        count++;
      } else {
        foodArticle.style.display = "none";
      }
    });
    this.foodsLength = count;

    this.updateFoodCount();
  }
}

customElements.define("main-wrapper", MainWrapper);
