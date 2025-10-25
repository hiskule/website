import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2/promise";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Simple route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users");
  res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
