const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Configure the PostgreSQL connection
const pool = new Pool({
  user: "postgre",
  host: "localhost",
  database: "foods",
  password: "Maral0924",
  port: 5432,
});

// Function to seed the foods table
const seedFoods = async () => {
  const foods = JSON.parse(
    fs.readFileSync(path.join(__dirname, "foods.json"), "utf8")
  );

  for (const food of foods) {
    await pool.query(
      "INSERT INTO foods (id, name, ingredients, instructions, difficulty, portion, type, duration, ingre, liked) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        food.id,
        food.name,
        food.ingredients,
        JSON.stringify(food.instructions),
        food.difficulty,
        food.portion,
        food.type,
        food.duration,
        food.ingre,
        false, // Assuming the 'liked' column defaults to false
      ]
    );
  }

  console.log("Foods table seeded successfully");
};

// Seed the foods table
seedFoods()
  .catch((err) => console.error("Error seeding foods table:", err))
  .finally(() => pool.end());
