// Foods fetching
fetch("foods.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(JSON.stringify(data));
  });
