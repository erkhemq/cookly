const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const foodsFilePath = path.join(__dirname, "data", "foods.json");
const ingredientsFilePath = path.join(__dirname, "data", "ingredients.json");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "front-end")));

// Route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "signin.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

// app.get(`/food?id=${id}`, (req, res) => {
//   res.sendFile(path.join(__dirname, `food-detailed.html?id=${id}`));
// });

// Helper function to read JSON file
const readJSONFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Get all food data
app.get("/api/foods", async (req, res) => {
  try {
    const foods = await readJSONFile(foodsFilePath);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Failed to read food data" });
  }
});

// Get all food data
app.get("/api/ingredients", async (req, res) => {
  try {
    const foods = await readJSONFile(ingredientsFilePath);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Failed to read food data" });
  }
});

// Like or dislike a food (toggle like)
app.post("/api/foods/:id/like", async (req, res) => {
  try {
    const foodId = parseInt(req.params.id);
    const foods = await readJSONFile(foodsFilePath);

    const food = foods.find((f) => f.id === foodId);
    if (food) {
      food.liked = !food.liked;
      fs.writeFile(foodsFilePath, JSON.stringify(foods, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: "Failed to update food data" });
        } else {
          res.json(food);
        }
      });
    } else {
      res.status(404).json({ error: "Food not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read food data" });
  }
});

// Get foods based on ingredient IDs
app.get("/api/foods/ingredients", async (req, res) => {
  try {
    const ingredientIds = req.query.ids.split(",").map((id) => parseInt(id));
    console.log("ing", ingredientIds);
    const foods = await readJSONFile(foodsFilePath);

    // Filter foods that have at least one matching ingredient ID
    const filteredFoods = foods.filter((food) =>
      food.ingre.some((ingredientId) => ingredientIds.includes(ingredientId))
    );

    // Prepare the response with matching counts
    const response = filteredFoods.map((food) => {
      const matchingCount = food.ingre.filter((ingredientId) =>
        ingredientIds.includes(ingredientId)
      ).length;
      return {
        ...food,
        matchingCount: matchingCount,
        message: `You have ${matchingCount} ingredients matched`,
      };
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to read food data" });
  }
});

// Get food by ID
app.get("/api/foods/:id", async (req, res) => {
  try {
    const foodId = parseInt(req.params.id);
    const foods = await readJSONFile(foodsFilePath);
    const food = foods.find((f) => f.id === foodId);

    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ error: "Food not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read food data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
