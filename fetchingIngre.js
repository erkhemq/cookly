// Ingredients
fetch("ingredients.json")
  .then((response) => response.json())
  .then((data) => {
    // Function to create and append type-wrapper articles
    function createTypeWrapper(type, imgSrc, foods, name) {
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
      h2.textContent = name; // Use the name property for the h2 tag
      const p = document.createElement("p");
      p.textContent = `0/${foods.length} найрлага`; // Initially, no items are selected

      const imgCaret = document.createElement("img");
      imgCaret.src = "./assets/caret.svg";
      imgCaret.width = 12;
      imgCaret.alt = "caret";
      imgCaret.classList.add("down-arrow");

      // Append elements to their respective parent elements
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
        ul.appendChild(li);
        // console.log("food", food);
      });
      article.appendChild(ul);

      ingreWrapper.appendChild(article);
    }

    // Display food items
    Object.entries(data).forEach(([type, { img, items, name }]) => {
      createTypeWrapper(type, img, items, name);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
