const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { sequelize, Team, Judge, Score } = require("./models/index.js");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hiskule API",
      version: "1.0.0",
      description: "API for Hiskule judging platform",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Local server",
      },
      {
        url: "https://api.hiskule.skule.ca",
        description: "Live server",
      },
    ],
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Security: Only show API docs on local testing environments, not on live Plesk server
if (process.env.NODE_ENV !== "production") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Backend is running
 */
// Simple route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

/**
 * @swagger
 * /judgeDropdown:
 *   get:
 *     summary: Get all judges
 *     responses:
 *       200:
 *         description: List of judges
 */
app.get("/judgeDropdown", async (req, res) => {
  try {
    const judges = await Judge.findAll();
    res.status(200).json(judges);
  } catch (error) {
    console.error("Error fetching judges:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     responses:
 *       200:
 *         description: List of rooms
 */
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

/**
 * @swagger
 * /rooms/{roomName}/teams:
 *   get:
 *     summary: Get teams by room name
 *     parameters:
 *       - in: path
 *         name: roomName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of teams in the room
 *       404:
 *         description: No teams found for room
 */
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


/**
 * @swagger
 * /judge:
 *   post:
 *     summary: Submit a score for a team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               judgeName:
 *                 type: string
 *               room:
 *                 type: string
 *               teamNumber:
 *                 type: integer
 *               category1:
 *                 type: integer
 *               category2:
 *                 type: integer
 *               category3:
 *                 type: integer
 *               category4:
 *                 type: integer
 *               category5:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Score submitted successfully
 *       400:
 *         description: Judge or Team not found
 */
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

/**
 * @swagger
 * /scores/{judgeName}/{teamNumber}:
 *   get:
 *     summary: Get previous score for a judge and team
 *     parameters:
 *       - in: path
 *         name: judgeName
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: teamNumber
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Previous score data
 *       404:
 *         description: Judge or Team not found
 */
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
