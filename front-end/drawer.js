import { getLikedFoods, setLikedFoods } from "./storage.js";

export class Drawer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="style.css">
      <section class="detail-wrapper"></section>
    `;
  }

  connectedCallback() {
    // Listen for the custom 'like-toggled' event to update the likes
    document.addEventListener("like-toggled", (event) => {
      const { id, liked } = event.detail;
      this.updateLikeState(id, liked);
    });
  }

  async updateDetailSection(id) {
    try {
      const response = await fetch(`/api/foods/${id}`, { method: "GET" });
      const selectedFood = await response.json();

      console.log("selected", selectedFood);

      const foodName = selectedFood.name;
      const foodIngredients = selectedFood.ingredients;

      this.createDetailWrapper(
        id,
        foodName,
        foodIngredients.length,
        foodIngredients,
        selectedFood.liked
      );

      // Add event listener to the exit icon to close the detail section
      this.shadowRoot
        .querySelector(".exit-icon")
        .addEventListener("click", () => {
          const section = this.shadowRoot.querySelector(".detail-wrapper");
          section.classList.remove("show-drawer");
          localStorage.removeItem("foodID");
        });
    } catch (error) {
      console.error("Error updating the detail section:", error);
    }
  }

  createDetailWrapper(id, name, count, ingredients, liked) {
    const section = this.shadowRoot.querySelector(".detail-wrapper");
    if (section) {
      // Clear existing content
      section.innerHTML = "";

      // Create article element for drawer heading
      const drawerHeading = document.createElement("article");
      drawerHeading.classList.add("drawer-heading");

      // Create h2 element
      const h2 = document.createElement("h2");
      h2.textContent = "Хоолны мэдээлэл";

      // Create div for exit icon
      const exitIcon = document.createElement("div");
      exitIcon.classList.add("exit-icon");

      // Create SVG for exit icon
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.classList.add("feather", "feather-x");

      // Create lines for SVG
      const line1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line1.setAttribute("x1", "18");
      line1.setAttribute("y1", "6");
      line1.setAttribute("x2", "6");
      line1.setAttribute("y2", "18");

      const line2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line2.setAttribute("x1", "6");
      line2.setAttribute("y1", "6");
      line2.setAttribute("x2", "18");
      line2.setAttribute("y2", "18");

      // Append lines to SVG
      svg.appendChild(line1);
      svg.appendChild(line2);

      // Append SVG to exit icon
      exitIcon.appendChild(svg);

      // Append h2 and exit icon to drawer heading
      drawerHeading.appendChild(h2);
      drawerHeading.appendChild(exitIcon);

      // Create img element
      const img = document.createElement("img");
      img.src = "./assets/food1.png";
      img.id = "food-cover";
      img.style.width = "100%";
      img.alt = "food1";

      // Create article element for detail top wrapper
      const detailTopWrapper = document.createElement("article");
      detailTopWrapper.classList.add("detail-top-wrapper");

      // Create div for food name
      const foodName = document.createElement("div");
      foodName.classList.add("food-name");

      // Create h3 element
      const h3 = document.createElement("h3");
      h3.textContent = name;

      // Create div for food share
      const foodShare = document.createElement("div");
      foodShare.classList.add("food-share");

      // Create heart icon
      const heartImg = document.createElement("img");
      heartImg.src = liked ? "./assets/filled-heart.svg" : "./assets/heart.svg";
      heartImg.width = 14;
      heartImg.alt = "heart";
      heartImg.classList.add("heart-img");
      heartImg.dataset.id = id;

      // Listen for like button click
      heartImg.addEventListener("click", () => {
        this.toggleLike(id);
      });

      // Create link icon
      const linkImg = document.createElement("img");
      linkImg.src = "./assets/link.svg";
      linkImg.width = 12;
      linkImg.alt = "link";

      // Append heart and link icons to food share
      foodShare.appendChild(heartImg);
      foodShare.appendChild(linkImg);

      // Append h3 and food share to food name
      foodName.appendChild(h3);
      foodName.appendChild(foodShare);

      // Create div for food subname
      const foodSubname = document.createElement("div");
      foodSubname.classList.add("food-subname");

      // Create small element
      const small = document.createElement("small");
      small.textContent = `Танд бүх ${count} найрлага байна`;

      // Create div for food rating
      const foodRating = document.createElement("div");
      foodRating.classList.add("food-rating");

      // Create star icons
      for (let i = 0; i < 5; i++) {
        const starImg = document.createElement("img");
        starImg.src = "./assets/star.svg";
        starImg.alt = "star";
        foodRating.appendChild(starImg);
      }

      // Append small and food rating to food subname
      foodSubname.appendChild(small);
      foodSubname.appendChild(foodRating);

      // Append food name and food subname to detail top wrapper
      detailTopWrapper.appendChild(foodName);
      detailTopWrapper.appendChild(foodSubname);

      // Create article element for detail bottom wrapper
      const detailBottomWrapper = document.createElement("article");
      detailBottomWrapper.classList.add("detail-bottom-wrapper");

      // Create h2 element
      const h2Bottom = document.createElement("h2");
      h2Bottom.textContent = "Орц, найрлага:";

      // Create ordered list
      const ol = document.createElement("ol");

      ingredients.forEach((ingredient) => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = ingredient;
        const checkImg = document.createElement("img");
        checkImg.src = "./assets/check.svg";
        checkImg.alt = "check";
        li.appendChild(p);
        li.appendChild(checkImg);
        ol.appendChild(li);
      });

      // Create a link element for the button
      const link = document.createElement("a");
      link.href = `food-detailed.html?id=${id}`;

      // Create button element
      const button = document.createElement("button");
      button.textContent = "Бүтэн жор үзэх";

      // Append button to link
      link.appendChild(button);

      // Append h2, ol, and link to detail bottom wrapper
      detailBottomWrapper.appendChild(h2Bottom);
      detailBottomWrapper.appendChild(ol);
      detailBottomWrapper.appendChild(link);

      // Append all elements to section
      section.appendChild(drawerHeading);
      section.appendChild(img);
      section.appendChild(detailTopWrapper);
      section.appendChild(detailBottomWrapper);

      // Add the 'show-drawer' class to display the drawer
      section.classList.add("show-drawer");
    }
  }

  toggleLike(id) {
    const likedFoods = getLikedFoods();
    likedFoods[id] = !likedFoods[id];
    setLikedFoods(likedFoods);

    // Dispatch custom event
    const likeEvent = new CustomEvent("like-toggled", {
      detail: { id, liked: likedFoods[id] },
    });
    document.dispatchEvent(likeEvent);

    this.updateDetailSection(id);
  }

  updateLikeState(id, liked) {
    const heartImg = this.shadowRoot.querySelector(
      `.heart-img[data-id="${id}"]`
    );
    if (heartImg) {
      heartImg.src = liked ? "./assets/filled-heart.svg" : "./assets/heart.svg";
    }
  }
}

customElements.define("drawer-section", Drawer);
