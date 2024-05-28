export function getLikedFoods() {
  return JSON.parse(localStorage.getItem("likedFoods")) || {};
}

export function setLikedFoods(foods) {
  const likedFoods = foods.reduce((acc, food) => {
    if (food.liked) {
      acc[food.id] = true;
    }
    return acc;
  }, {});
  localStorage.setItem("likedFoods", JSON.stringify(likedFoods));
}
