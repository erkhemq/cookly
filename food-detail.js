class RecipeComponent extends HTMLElement {
  constructor() {
    super();

    // Attach a shadow DOM tree to this instance
    const shadow = this.attachShadow({ mode: "open" });

    // Create the template
    const template = document.createElement("template");
    template.innerHTML = `
        <link rel="stylesheet" href="style.css">
        <section class="recipe-wrapper">
          <section class="recipe-detail">
            <div class="recipe-image">
              <img src="" alt="Recipe Image" />
            </div>
            <div class="recipe-content">
              <article class="detail-top-wrapper">
                <div class="food-name">
                  <h3></h3>
                  <div class="food-share">
                    <img src="./assets/heart.svg" width="14" alt="heart class="like-button" />
                    <img src="./assets/link.svg" width="12" alt="link" />
                  </div>
                </div>
                <div class="food-subname">
                  <small></small>
                  <div class="food-rating">
                    <img src="./assets/star.svg" alt="star" />
                    <img src="./assets/star.svg" alt="star" />
                    <img src="./assets/star.svg" alt="star" />
                    <img src="./assets/star.svg" alt="star" />
                    <img src="./assets/star.svg" alt="star" />
                  </div>
                </div>
              </article>
              <article class="detail-info">
                <div class="info-item">
                  <img src="./assets/difficulty.svg" alt="difficulty" />
                  <span></span>
                </div>
                <div class="info-item">
                  <img src="./assets/portion.svg" alt="portion" />
                  <span></span>
                </div>
                <div class="info-item">
                  <img src="./assets/type.svg" alt="type" />
                  <span></span>
                </div>
                <div class="info-item">
                  <img src="./assets/duration.svg" alt="duration" />
                  <span></span>
                </div>
              </article>
              <article class="detail-bottom-wrapper">
                <h2>Орц, найрлага:</h2>
                <ol class="ingredients-list"></ol>
                <h2>Заавар:</h2>
                <ol class="instructions-list"></ol>
              </article>
            </div>
          </section>
        </section>
      `;

    // Append the template content to the shadow root
    shadow.appendChild(template.content.cloneNode(true));

    // Element references
    this.recipeImage = shadow.querySelector(".recipe-image img");
    this.recipeName = shadow.querySelector(".food-name h3");
    this.foodSubname = shadow.querySelector(".food-subname small");
    this.difficulty = shadow.querySelector(
      ".detail-info .info-item:nth-child(1) span"
    );
    this.portion = shadow.querySelector(
      ".detail-info .info-item:nth-child(2) span"
    );
    this.type = shadow.querySelector(
      ".detail-info .info-item:nth-child(3) span"
    );
    this.duration = shadow.querySelector(
      ".detail-info .info-item:nth-child(4) span"
    );
    this.ingredientsList = shadow.querySelector(".ingredients-list");
    this.instructionsList = shadow.querySelector(".instructions-list");

    // Get the ID from the URL query string
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      this.fetchRecipe(id);
    }
  }

  static get observedAttributes() {
    return ["data-id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-id" && oldValue !== newValue) {
      this.fetchRecipe(newValue);
    }
  }

  async fetchRecipe(id) {
    try {
      const response = await fetch("foods.json");
      const foods = await response.json();
      const recipe = foods.find((recipe) => recipe.id === parseInt(id));
      if (recipe) {
        this.renderRecipe(recipe);
      }
    } catch (error) {
      console.error("Error fetching the food data:", error);
    }
  }

  renderRecipe(recipe) {
    this.recipeImage.src = `./assets/food${recipe.id}.png`;
    this.recipeName.textContent = recipe.name;
    this.foodSubname.textContent = `Танд бүх ${recipe.ingredients.length} найрлага байна`;

    // Update difficulty, portion, type, and duration
    this.difficulty.textContent = `Хүндийн зэрэг: ${
      recipe.difficulty === "easy" ? "Амархан" : recipe.difficulty
    }`;
    this.portion.textContent = `Хувь: ${recipe.portion}`;
    this.type.textContent = `Төрөл: ${recipe.type}`;
    this.duration.textContent = `Хугацаа: ${recipe.duration} минут`;

    // Render ingredients
    this.ingredientsList.innerHTML = ""; // Clear existing content
    recipe.ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.innerHTML = `<p>${ingredient}</p><img src="./assets/check.svg" alt="check" />`;
      this.ingredientsList.appendChild(li);
    });

    // Render instructions
    this.instructionsList.innerHTML = ""; // Clear existing content
    recipe.instructions.forEach((instruction) => {
      const li = document.createElement("li");
      li.innerHTML = `<p>${instruction.description}</p>`;
      this.instructionsList.appendChild(li);
    });
  }
}

// Define the new element
customElements.define("recipe-component", RecipeComponent);
