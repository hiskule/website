import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2/promise";
import { sequelize, Team, Judge, Score } from "./models/index.js";

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

app.get("/judgeDropdown", async (req, res) => {
  try {
    const judges = await Judge.findAll();
    res.status(200).json(judges);
  } catch (error) {
    console.error("Error fetching judges:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/rooms", async (req, res) => {
  try {
    const teams = await Team.findAll({ attributes: ["room"] });
    const rooms = [...new Set(teams.map((t) => t.room))];
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/rooms/:roomName/teams", async (req, res) => {
  try {
    const { roomName } = req.params;

    const teams = await Team.findAll({
      where: { room: roomName },
    });

    if (teams.length === 0) {
      return res.status(404).json({ message: `No teams found for room: ${roomName}` });
    }

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams by room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/judge", async (req, res) => {
  const { judgeName, room, teamNumber, category1, category2, category3, category4, category5 } = req.body;

  // find judge
  const judge = await Judge.findOne({ where: { name: judgeName } });
  if (!judge) {
    return res.status(400).json({ error: "Judge not found" });
  }

  // find team
  const team = await Team.findOne({ where: { team_number: teamNumber } });
  if (!team) {
    return res.status(400).json({ error: "Team not found" });
  }

  // check if this judge already scored this team
  const existing = await Score.findOne({ where: { judgeId: judge.id, teamId: team.id } });

  if (existing) {
    await existing.update({ category1, category2, category3, category4, category5 });
    return res.json({ message: "Scores updated", existing });
  }

  // otherwise create a new score entry
  const score = await Score.create({
    judgeId: judge.id,
    teamId: team.id,
    category1,
    category2,
    category3,
    category4,
    category5
  });

  res.json({ message: "New scores submitted", score });
});

// GET previous score for a judge and team
app.get("/scores/:judgeName/:teamNumber/", async (req, res) => {
  const { judgeName, teamNumber } = req.params;

  const judge = await Judge.findOne({ where: { name: judgeName } });
  const team = await Team.findOne({ where: { team_number: teamNumber } });

  if (!judge || !team) {
    return res.status(404).json({ error: "Judge or Team not found" });
  }

  const score = await Score.findOne({ where: { judgeId: judge.id, teamId: team.id } });

  if (!score) return res.json({ previousScores: null });

  res.json({ previousScores: score });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
