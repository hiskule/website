// ============================================================================
// #################### CONFIGURATION & SETUP ####################
// ============================================================================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sequelize, Competition, Team, Judge, Score, dbError } = require("./models/index.js");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================================
// #################### SWAGGER CONFIGURATION ####################
// ============================================================================
// Security: Only show API docs and load Swagger libraries on local testing environments
if (process.env.NODE_ENV !== "production") {
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
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// ============================================================================
// #################### GLOBAL ENDPOINTS ####################
// ============================================================================
/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     responses:
 *       200:
 *         description: Success
 */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Hiskule API!" });
});

/**
 * @swagger
 * /reset-db:
 *   post:
 *     summary: DANGER! Wipes and recreates the entire database
 *     responses:
 *       200:
 *         description: Database completely wiped and recreated successfully!
 *       500:
 *         description: Internal server error
 */
app.post("/reset-db", async (req, res) => {
  try {
    // force: true drops all tables and recreates them
    await sequelize.sync({ force: true });
    res.json({ message: "Database completely wiped and recreated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// #################### COMPETITION ENDPOINTS ####################
// ============================================================================
/**
 * @swagger
 * /competitions:
 *   get:
 *     summary: Get all competitions
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
app.get("/competitions", async (req, res) => {
  try {
    const comps = await Competition.findAll();
    res.json(comps);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================================================
// #################### JUDGE ENDPOINTS ####################
// ============================================================================
/**
 * @swagger
 * /judgeDropdown:
 *   get:
 *     summary: Get all judges for a specific competition
 *     parameters:
 *       - in: query
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: competitionId required
 *       500:
 *         description: Internal server error
 */
app.get("/judgeDropdown", async (req, res) => {
  try {
    const { competitionId } = req.query;
    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    const judges = await Judge.findAll({ where: { competitionId } });
    res.status(200).json(judges);
  } catch (error) {
    console.error("Error fetching judges:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /judges/{judgeId}/schedule:
 *   get:
 *     summary: Get a judge's team schedule based on their assigned room
 *     parameters:
 *       - in: path
 *         name: judgeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: competitionId required or Judge is not assigned to a room
 *       404:
 *         description: Judge not found
 *       500:
 *         description: Internal server error
 */
app.get("/judges/:judgeId/schedule", async (req, res) => {
  try {
    const { judgeId } = req.params;
    const { competitionId } = req.query;

    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    const judge = await Judge.findOne({ where: { id: judgeId, competitionId } });
    if (!judge) return res.status(404).json({ error: "Judge not found" });
    if (!judge.room) return res.status(400).json({ error: "Judge is not assigned to a room" });

    // Fetch teams in that room, ordered by time_slot
    const teams = await Team.findAll({
      where: { room: judge.room, competitionId },
      order: [["time_slot", "ASC"]]
    });

    res.json({
      judgeName: judge.name,
      room: judge.room,
      schedule: teams
    });
  } catch (error) {
    console.error("Error fetching judge schedule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================================================
// #################### ROOM & TEAM ENDPOINTS ####################
// ============================================================================
/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms for a specific competition
 *     parameters:
 *       - in: query
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: competitionId required
 *       500:
 *         description: Internal server error
 */
app.get("/rooms", async (req, res) => {
  try {
    const { competitionId } = req.query;
    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    const judges = await Judge.findAll({ where: { competitionId } });
    const teams = await Team.findAll({ where: { competitionId }, attributes: ["room"] });

    // Extract unique room names from both judges and teams
    const roomNames = [...new Set([
      ...judges.map(j => j.room).filter(Boolean),
      ...teams.map(t => t.room).filter(Boolean)
    ])];

    const roomsData = roomNames.map(roomName => {
      const roomJudges = judges.filter(j => j.room === roomName).map(j => j.name);
      return {
        room: roomName,
        judges: roomJudges.length > 0 ? roomJudges : ["NO JUDGE"]
      };
    });

    res.status(200).json(roomsData);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /rooms/{roomName}/teams:
 *   get:
 *     summary: Get teams by room name and competition
 *     parameters:
 *       - in: path
 *         name: roomName
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: competitionId required
 *       404:
 *         description: No teams found for room
 *       500:
 *         description: Internal server error
 */
app.get("/rooms/:roomName/teams", async (req, res) => {
  try {
    const { roomName } = req.params;
    const { competitionId } = req.query;
    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    const teams = await Team.findAll({
      where: { room: roomName, competitionId },
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


// ============================================================================
// #################### SCORING ENDPOINTS ####################
// ============================================================================
/**
 * @swagger
 * /judge:
 *   post:
 *     summary: Submit JSON scores for a team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               competitionId:
 *                 type: integer
 *               judgeName:
 *                 type: string
 *               teamNumber:
 *                 type: integer
 *               scores:
 *                 type: object
 *                 description: Dynamic JSON object mapping category names to integer scores
 *               feedback:
 *                 type: string
 *                 description: Text feedback from the judge
 *     responses:
 *       200:
 *         description: Scores submitted successfully
 *       400:
 *         description: Missing required fields or Judge/Team not found
 *       500:
 *         description: Internal server error
 */
app.post("/judge", async (req, res) => {
  const { competitionId, judgeName, teamNumber, scores, feedback } = req.body;

  if (!competitionId || !judgeName || !teamNumber || !scores) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // find judge
  const judge = await Judge.findOne({ where: { name: judgeName, competitionId } });
  if (!judge) {
    return res.status(400).json({ error: "Judge not found in this competition" });
  }

  // find team
  const team = await Team.findOne({ where: { team_number: teamNumber, competitionId } });
  if (!team) {
    return res.status(400).json({ error: "Team not found in this competition" });
  }

  // check if this judge already scored this team
  const existing = await Score.findOne({ where: { judgeId: judge.id, teamId: team.id } });

  if (existing) {
    await existing.update({ scores, feedback });
    return res.json({ message: "Scores updated", existing });
  }

  // otherwise create a new score entry
  const score = await Score.create({
    judgeId: judge.id,
    teamId: team.id,
    scores,
    feedback
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
 *       - in: query
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success (Returns previousScores object or null)
 *       400:
 *         description: competitionId required
 *       404:
 *         description: Judge or Team not found
 *       500:
 *         description: Internal server error
 */
app.get("/scores/:judgeName/:teamNumber/", async (req, res) => {
  const { judgeName, teamNumber } = req.params;
  const { competitionId } = req.query;

  if (!competitionId) return res.status(400).json({ error: "competitionId required" });

  const judge = await Judge.findOne({ where: { name: judgeName, competitionId } });
  const team = await Team.findOne({ where: { team_number: teamNumber, competitionId } });

  if (!judge || !team) {
    return res.status(404).json({ error: "Judge or Team not found" });
  }

  const score = await Score.findOne({ where: { judgeId: judge.id, teamId: team.id } });

  if (!score) return res.json({ previousScores: null });

  res.json({ previousScores: score });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
