// ============================================================================
// #################### CONFIGURATION & SETUP ####################
// ============================================================================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sequelize, Competition, Team, Judge, Room, Score, dbError } = require("./models/index.js");

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
 *     tags: [Global]
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
 *     tags: [Global]
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

/**
 * @swagger
 * /seed-db:
 *   post:
 *     summary: Seed the database with competitions.json data
 *     tags: [Global]
 *     responses:
 *       200:
 *         description: Database successfully seeded!
 *       500:
 *         description: Internal server error
 */
app.post("/seed-db", async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const competitionsPath = path.resolve(__dirname, 'data/competitions.json');
    
    if (!fs.existsSync(competitionsPath)) {
      return res.status(404).json({ error: "competitions.json file not found on server" });
    }
    
    const competitionsData = JSON.parse(fs.readFileSync(competitionsPath, 'utf-8'));

    for (const compData of competitionsData) {
      const comp = await Competition.create({
        name: compData.name,
        isActive: compData.isActive || false,
        date: compData.date || new Date(),
        categories: compData.categories || []
      });

      const uniqueRooms = new Set();
      (compData.judges || []).forEach(j => { if (j.room) uniqueRooms.add(j.room); });
      (compData.teams || []).forEach(t => { if (t.room) uniqueRooms.add(t.room); });

      const roomMap = {};
      for (const roomName of uniqueRooms) {
        const room = await Room.create({ name: roomName, competitionId: comp.id });
        roomMap[roomName] = room.id;
      }

      for (const j of (compData.judges || [])) {
        await Judge.create({
          name: j.name,
          roomId: roomMap[j.room] || null,
          username: j.username,
          password: j.password,
          competitionId: comp.id
        });
      }

      for (const t of (compData.teams || [])) {
        await Team.create({
          team_number: t.team_number,
          roomId: roomMap[t.room] || null,
          start_time: t.start_time,
          end_time: t.end_time,
          username: t.username,
          password: t.password,
          competitionId: comp.id
        });
      }
    }

    res.json({ message: "Successfully seeded database with complete logistics!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// #################### AUTHENTICATION ENDPOINTS ####################
// ============================================================================
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Unified login for Judges and Teams
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success, returns role and user data
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Competition is closed
 *       500:
 *         description: Internal server error
 */
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Master Admin Intercept
    if (username === "admin" && password === process.env.ADMIN_PASSWORD) {
      return res.json({ role: "admin", user: { username: "admin" } });
    }

    let user = await Judge.findOne({ where: { username, password }, attributes: { exclude: ['password'] } });
    let role = "judge";

    if (!user) {
      user = await Team.findOne({ where: { username, password }, attributes: { exclude: ['password'] } });
      role = "team";
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const comp = await Competition.findByPk(user.competitionId);
    if (!comp || !comp.isActive) {
      return res.status(403).json({ error: "This competition is currently closed." });
    }

    return res.json({ role, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
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
 *     tags: [Competitions]
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

/**
 * @swagger
 * /competitions/{id}:
 *   get:
 *     summary: Get a specific competition (useful for fetching the grading rubric/categories)
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Competition not found
 *       500:
 *         description: Internal server error
 */
app.get("/competitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comp = await Competition.findByPk(id);
    if (!comp) return res.status(404).json({ error: "Competition not found" });
    res.json(comp);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /competitions/{id}/activate:
 *   post:
 *     summary: Set a competition as active (and deactivate all others)
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Competition activated
 *       404:
 *         description: Competition not found
 *       500:
 *         description: Internal server error
 */
app.post("/competitions/:id/activate", async (req, res) => {
  try {
    const { id } = req.params;
    const comp = await Competition.findByPk(id);
    if (!comp) return res.status(404).json({ error: "Competition not found" });

    // Set all others to false
    await Competition.update({ isActive: false }, { where: {} });
    
    // Set this one to true
    await comp.update({ isActive: true });

    res.json({ message: `Competition ${comp.name} activated successfully`, competition: comp });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /competitions/deactivate-all:
 *   post:
 *     summary: Lock down the platform by deactivating all competitions
 *     tags: [Competitions]
 *     responses:
 *       200:
 *         description: All competitions deactivated
 *       500:
 *         description: Internal server error
 */
app.post("/competitions/deactivate-all", async (req, res) => {
  try {
    await Competition.update({ isActive: false }, { where: {} });
    res.json({ message: "All competitions have been deactivated. Logins are now closed." });
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
 *     tags: [Judges]
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
 *     tags: [Judges]
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
    if (!judge.roomId) return res.status(400).json({ error: "Judge is not assigned to a room" });

    // Fetch teams in that room, ordered by start_time
    const teams = await Team.findAll({
      where: { roomId: judge.roomId, competitionId },
      order: [["start_time", "ASC"]]
    });

    const room = await Room.findByPk(judge.roomId);

    res.json({
      judgeName: judge.name,
      room: room ? room.name : null,
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
 * /teams/{teamId}/submission:
 *   post:
 *     summary: Submit a presentation link and comments
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               link:
 *                 type: string
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully submitted
 *       400:
 *         description: Missing fields
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal server error
 */
app.post("/teams/:teamId/submission", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { competitionId } = req.query;
    const { link, comments } = req.body;

    if (!competitionId) return res.status(400).json({ error: "competitionId required" });
    
    const team = await Team.findOne({ where: { id: teamId, competitionId } });
    if (!team) return res.status(404).json({ error: "Team not found" });

    await team.update({
      presentation_link: link,
      team_comments: comments,
      submission_time: new Date()
    });

    res.json({ message: "Submission successful", team });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /teams/{teamId}/scores:
 *   get:
 *     summary: Get all scores and feedback a team has received from all judges
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
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
 *         description: competitionId required
 *       500:
 *         description: Internal server error
 */
app.get("/teams/:teamId/scores", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { competitionId } = req.query;
    
    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    // Ensure the team is in this competition
    const team = await Team.findOne({ where: { id: teamId, competitionId } });
    if (!team) return res.status(404).json({ error: "Team not found" });

    const scores = await Score.findAll({
      where: { teamId },
      include: [{ model: Judge, attributes: ['name'] }]
    });

    res.json(scores);
  } catch (error) {
    console.error("Error fetching team scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms for a specific competition
 *     tags: [Rooms]
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

    const rooms = await Room.findAll({
      where: { competitionId },
      include: [{ model: Judge, attributes: ['name'] }]
    });

    const roomsData = rooms.map(r => ({
      id: r.id,
      room: r.name,
      judges: r.Judges.length > 0 ? r.Judges.map(j => j.name) : ["NO JUDGE"]
    }));

    res.status(200).json(roomsData);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /rooms/{roomId}/teams:
 *   get:
 *     summary: Get teams by room ID and competition
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
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
 *         description: competitionId required
 *       404:
 *         description: No teams found for room
 *       500:
 *         description: Internal server error
 */
app.get("/rooms/:roomId/teams", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { competitionId } = req.query;
    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    const teams = await Team.findAll({
      where: { roomId, competitionId },
    });

    if (teams.length === 0) {
      return res.status(404).json({ message: `No teams found for room ID: ${roomId}` });
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
 *     tags: [Judges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               competitionId:
 *                 type: integer
 *               judgeId:
 *                 type: integer
 *               teamId:
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
  const { competitionId, judgeId, teamId, scores, feedback } = req.body;

  if (!competitionId || !judgeId || !teamId || !scores) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // find judge
  const judge = await Judge.findOne({ where: { id: judgeId, competitionId } });
  if (!judge) {
    return res.status(400).json({ error: "Judge not found in this competition" });
  }

  // find team
  const team = await Team.findOne({ where: { id: teamId, competitionId } });
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
 * /scores/{judgeId}/{teamId}:
 *   get:
 *     summary: Get previous score for a judge and team
 *     tags: [Judges]
 *     parameters:
 *       - in: path
 *         name: judgeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: teamId
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
app.get("/scores/:judgeId/:teamId", async (req, res) => {
  const { judgeId, teamId } = req.params;
  const { competitionId } = req.query;

  if (!competitionId) return res.status(400).json({ error: "competitionId required" });

  const judge = await Judge.findOne({ where: { id: judgeId, competitionId } });
  const team = await Team.findOne({ where: { id: teamId, competitionId } });

  if (!judge || !team) {
    return res.status(404).json({ error: "Judge or Team not found" });
  }

  const score = await Score.findOne({ where: { judgeId: judge.id, teamId: team.id } });

  if (!score) return res.json({ previousScores: null });

  res.json({ previousScores: score });
});

/**
 * @swagger
 * /scores:
 *   get:
 *     summary: Get all scores for a specific competition (Leaderboard/Admin)
 *     tags: [Admin]
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
app.get("/scores", async (req, res) => {
  try {
    const { competitionId } = req.query;
    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    // Fetch all judges and teams in the competition first
    const judges = await Judge.findAll({ where: { competitionId } });
    const teams = await Team.findAll({ where: { competitionId } });

    const judgeIds = judges.map(j => j.id);
    const teamIds = teams.map(t => t.id);

    // Fetch scores that belong to these judges and teams
    const scores = await Score.findAll({
      where: {
        judgeId: judgeIds,
        teamId: teamIds
      },
      include: [
        { model: Judge, attributes: ['name'] },
        { model: Team, attributes: ['team_number'] }
      ]
    });

    res.json(scores);
  } catch (error) {
    console.error("Error fetching leaderboard scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
