class IngredientManager extends HTMLElement {
  // template ashiglah // tusdaa css ashiglah
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.selectedIngreCount = 0;
    this.ingredients = [];
    this.shadowRoot.innerHTML = `
          <link rel="stylesheet" href="style.css">
          <aside>
            <article class="title-fridge">
              <h2>Агуулах</h2>
              <h3 class="ingre-count">Танд 0 орц байна</h3>
            </article>
            <div class="search-wrapper">
              <img src="./assets/search.svg" class="search-icon" />
              <input
                type="text"   
                placeholder="Орц хайх"
                class="search"
              />
            </div>
            <section class="ingre-wrapper"></section>
          </aside>
        `;
  }

  connectedCallback() {
    this.fetchIngredients();
    this.shadowRoot
      .querySelector(".search")
      .addEventListener("input", this.handleSearch.bind(this));
  }

  async fetchIngredients() {
    try {
      const response = await fetch("ingredients.json");
      const data = await response.json();

      Object.entries(data).forEach(([type, { img, items, name }]) => {
        this.createTypeWrapper(type, img, items, name);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  createTypeWrapper(type, imgSrc, foods, name) {
    let selectedCount = 0;
    const ingreWrapper = this.shadowRoot.querySelector(".ingre-wrapper");

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
          this.selectedIngreCount++;
          li.classList.add("activeToggleButton");
          li.classList.remove("disactiveToggleButton");
          this.ingredients.push(food.id);
        } else {
          selectedCount--;
          this.selectedIngreCount--;
          li.classList.remove("activeToggleButton");
          li.classList.add("disactiveToggleButton");
          const temp = this.ingredients.indexOf(food.id);
          if (temp > -1) {
            this.ingredients.splice(temp, 1);
          }
        }
        this.showSelectedIngreCount(this.selectedIngreCount);
        p.textContent = `${selectedCount}/${foods.length} найрлага`;
      });
      ul.appendChild(li);
    });
    article.appendChild(ul);

    divTypeHeader.addEventListener("click", () => {
      ul.classList.toggle("visible");
      const isVisible = ul.classList.contains("visible");
      imgCaret.classList.toggle("down-arrow", !isVisible);
      imgCaret.classList.toggle("up-arrow", isVisible);
    });

    ingreWrapper.appendChild(article);
  }

  showSelectedIngreCount(count) {
    const ingreCount = this.shadowRoot.querySelector(".ingre-count");
    ingreCount.textContent = `Танд ${count} орц байна`;
  }

  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const lis = this.shadowRoot.querySelectorAll(".type-bottom li");
    lis.forEach((li) => {
      if (li.textContent.toLowerCase().includes(searchTerm)) {
        li.style.display = "block";
      } else {
        li.style.display = "none";
      }
    });
  }
}

customElements.define("ingredient-manager", IngredientManager);
