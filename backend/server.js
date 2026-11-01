// ============================================================================
// #################### CONFIGURATION & SETUP ####################
// ============================================================================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sequelize, Competition, Team, Judge, Room, Score, dbError } = require("./models/index.js");
const { getLeaderboardData } = require("./utils/leaderboardLogic.js");
const { verifyAdmin, verifyJudge, verifyTeam, verifySystemToken, JWT_SECRET } = require("./middleware/auth.js");
const jwt = require('jsonwebtoken');

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
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
          apiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "x-api-key",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
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
 * /seed-db:
 *   post:
 *     summary: Seed the database with JSON data
 *     tags: [Global]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *           default: uthsdc-2026.json
 *         description: The name of the JSON file in the data folder
 *     responses:
 *       200:
 *         description: Database successfully seeded!
 *       500:
 *         description: Internal server error
 */
app.post("/seed-db", verifySystemToken, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filename = req.query.filename || 'uthsdc-2026.json';
    const competitionsPath = path.resolve(__dirname, 'data', filename);

    if (!fs.existsSync(competitionsPath)) {
      return res.status(404).json({ error: `${filename} file not found on server` });
    }

    const competitionsData = JSON.parse(fs.readFileSync(competitionsPath, 'utf-8'));

    for (const compData of competitionsData) {
      // Check if event already exists. If so, wipe it clean (explicit manual cascade for MySQL/MariaDB safety).
      const existingComp = await Competition.findOne({ where: { name: compData.name } });
      if (existingComp) {
        const oldTeams = await Team.findAll({ where: { competitionId: existingComp.id } });
        const oldJudges = await Judge.findAll({ where: { competitionId: existingComp.id } });
        const teamIds = oldTeams.map(t => t.id);
        const judgeIds = oldJudges.map(j => j.id);

        if (teamIds.length > 0) await Score.destroy({ where: { teamId: teamIds } });
        if (judgeIds.length > 0) await Score.destroy({ where: { judgeId: judgeIds } });

        await Team.destroy({ where: { competitionId: existingComp.id } });
        await Judge.destroy({ where: { competitionId: existingComp.id } });
        await Room.destroy({ where: { competitionId: existingComp.id } });
        await existingComp.destroy();
      }

      // Clean up any lingering judges/teams with matching usernames from this dataset
      const judgeUsernames = (compData.judges || []).map(j => j.username).filter(Boolean);
      const teamUsernames = (compData.teams || []).map(t => t.username).filter(Boolean);
      if (judgeUsernames.length > 0) await Judge.destroy({ where: { username: judgeUsernames } });
      if (teamUsernames.length > 0) await Team.destroy({ where: { username: teamUsernames } });

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

    const details = competitionsData.map(c => ({
      event_name: c.name,
      total_judges_seeded: (c.judges || []).length,
      total_teams_seeded: (c.teams || []).length
    }));

    res.json({ 
      message: `Successfully seeded ${competitionsData.length} event(s) from ${filename}!`,
      details 
    });
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

    // Master Admin Intercept (supports "admin", "admin1", "admin2", "admin3", etc.)
    const adminMatch = username.match(/^admin(\d+)?$/i);
    if (adminMatch && password === process.env.ADMIN_PASSWORD) {
      const adminNum = adminMatch[1];
      const displayName = adminNum ? `Admin ${adminNum}` : "Admin";
      const token = jwt.sign({ role: "admin", username }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ role: "admin", user: { username, name: displayName }, token });
    }

    // 1. Try to find a Judge in an active competition
    let user = await Judge.findOne({
      where: { username, password },
      include: [{
        model: Competition,
        where: { isActive: true },
        required: true
      }],
      attributes: { exclude: ['password'] }
    });
    let role = "judge";

    // 2. Try to find a Team in an active competition
    if (!user) {
      user = await Team.findOne({
        where: { username, password },
        include: [{
          model: Competition,
          where: { isActive: true },
          required: true
        }],
        attributes: { exclude: ['password'] }
      });
      role = "team";
    }

    // 3. If found in active competition, issue token and log in
    if (user) {
      const token = jwt.sign({ id: user.id, role, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ role, user, token });
    }

    // 4. If not found in active competition, check if credentials exist in an inactive competition
    const inactiveJudge = await Judge.findOne({
      where: { username, password },
      include: [{ model: Competition, required: false }],
      attributes: { exclude: ['password'] },
      order: [['id', 'DESC']]
    });

    const inactiveTeam = inactiveJudge ? null : await Team.findOne({
      where: { username, password },
      include: [{ model: Competition, required: false }],
      attributes: { exclude: ['password'] },
      order: [['id', 'DESC']]
    });

    if (inactiveJudge || inactiveTeam) {
      return res.status(403).json({ error: "This competition is currently closed." });
    }

    return res.status(401).json({ error: "Invalid credentials" });
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
    const comps = await Competition.findAll({
      order: [['date', 'ASC']]
    });
    const parsedComps = comps.map(c => {
      const json = c.toJSON();
      if (typeof json.categories === 'string') {
        try { json.categories = JSON.parse(json.categories); } catch (e) { json.categories = []; }
      }
      return json;
    });
    res.json(parsedComps);
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
    const json = comp.toJSON();
    if (typeof json.categories === 'string') {
      try { json.categories = JSON.parse(json.categories); } catch (e) { json.categories = []; }
    }
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /competitions/{id}/release-feedback:
 *   put:
 *     summary: Toggle feedback release for a competition
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               feedbackReleased:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Feedback release status updated
 *       404:
 *         description: Competition not found
 */
app.put("/competitions/:id/release-feedback", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { feedbackReleased } = req.body;

    const competition = await Competition.findByPk(id);
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    competition.feedbackReleased = feedbackReleased;
    await competition.save();

    res.json({ message: "Feedback release status updated", feedbackReleased: competition.feedbackReleased });
  } catch (error) {
    console.error("Error updating feedback release status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /competitions/{id}/export-csv:
 *   get:
 *     summary: Export competition scores to CSV
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV file download
 *       404:
 *         description: Competition not found
 *       500:
 *         description: Internal server error
 */
app.get("/competitions/:id/export-csv", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const competition = await Competition.findByPk(id);
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    let categoriesRaw = competition.categories;
    if (typeof categoriesRaw === 'string') {
      try { categoriesRaw = JSON.parse(categoriesRaw); } catch (e) { categoriesRaw = {}; }
    }

    // Helper for RFC 4180 CSV escaping
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (str.includes(",") || str.includes("\"") || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Helper to strip markdown ### headers and format into clean text
    const cleanFeedbackForCsv = (rawFeedback) => {
      if (!rawFeedback || typeof rawFeedback !== 'string') return "";
      const text = rawFeedback.trim();
      if (!text) return "";

      const strengthsMatch = text.match(/(?:###\s*Strengths|Strengths:?)\s*([\s\S]*?)(?=(?:###\s*Areas for Improvement|Areas for Improvement:?|###\s*Additional Comments|Additional Comments:?|$))/i);
      const improvementsMatch = text.match(/(?:###\s*Areas for Improvement|Areas for Improvement:?)\s*([\s\S]*?)(?=(?:###\s*Additional Comments|Additional Comments:?|$))/i);
      const commentsMatch = text.match(/(?:###\s*Additional Comments|Additional Comments:?)\s*([\s\S]*?)$/i);

      if (strengthsMatch || improvementsMatch || commentsMatch) {
        const sections = [];
        if (strengthsMatch && strengthsMatch[1].trim()) {
          sections.push(`Strengths:\n${strengthsMatch[1].trim()}`);
        }
        if (improvementsMatch && improvementsMatch[1].trim()) {
          sections.push(`Areas for Improvement:\n${improvementsMatch[1].trim()}`);
        }
        if (commentsMatch && commentsMatch[1].trim()) {
          sections.push(`Additional Comments:\n${commentsMatch[1].trim()}`);
        }
        return sections.join("\n\n");
      }

      // If flat / unstructured text, clean any markdown heading hashes
      return text.replace(/^###\s+/gm, "").trim();
    };

    const formatCombinedFeedback = (scores) => {
      const parts = [];
      scores.forEach((s, idx) => {
        const cleaned = cleanFeedbackForCsv(s.feedback);
        if (cleaned) {
          parts.push(`[Judge ${idx + 1}]\n${cleaned}`);
        }
      });
      return parts.join("\n\n----------------------------------------\n\n");
    };

    const teams = await Team.findAll({
      where: { competitionId: id },
      include: [{ model: Score }],
      order: [['team_number', 'ASC']]
    });

    const isStructured = categoriesRaw && typeof categoriesRaw === 'object' && !Array.isArray(categoriesRaw) && Array.isArray(categoriesRaw.sections);

    let csvLines = [];

    if (isStructured) {
      // Structured rubric (e.g., UTHSDC 2026 with sections and penalties)
      const criteriaList = [];
      categoriesRaw.sections.forEach(sec => {
        (sec.criteria || []).forEach(crit => {
          criteriaList.push(crit);
        });
      });
      const penaltiesList = Array.isArray(categoriesRaw.penalties) ? categoriesRaw.penalties : [];
      const maxScore = Number(categoriesRaw.total_max_score) || 25;

      const headers = ["Team Number"];
      for (const crit of criteriaList) {
        headers.push(`${crit.id} ${crit.name} (${crit.max_score})`);
      }
      headers.push(
        `Raw Score (Avg) (/${maxScore})`,
        "Penalties Enforced",
        `Final Score (Avg) (/${maxScore})`,
        "Judges Graded",
        "Feedback"
      );
      csvLines.push(headers.map(escapeCsv).join(","));

      for (const team of teams) {
        const scores = (team.Scores || []).sort((a, b) => a.id - b.id);
        if (scores.length === 0) {
          const row = [
            `Team ${team.team_number}`,
            ...criteriaList.map(() => ""),
            "",
            "None",
            "",
            "0",
            ""
          ];
          csvLines.push(row.map(escapeCsv).join(","));
        } else {
          // Average for each criterion across all submitted judge scores for this team
          const critValues = criteriaList.map(crit => {
            let sum = 0;
            let count = 0;
            scores.forEach(s => {
              let scoreMap = s.scores;
              if (typeof scoreMap === 'string') {
                try { scoreMap = JSON.parse(scoreMap); } catch (e) { scoreMap = {}; }
              }
              if (!scoreMap || typeof scoreMap !== 'object') scoreMap = {};
              const criteriaScores = scoreMap.criteria || scoreMap;
              const val = criteriaScores[crit.id] !== undefined ? criteriaScores[crit.id] : criteriaScores[crit.name];
              if (val !== undefined && val !== null && val !== "" && !isNaN(Number(val))) {
                sum += Number(val);
                count++;
              }
            });
            if (count === 0) return "";
            const avg = Number((sum / count).toFixed(2));
            return `${avg} / ${crit.max_score}`;
          });

          // Compute raw scores, penalties, and final scores across judges
          let rawSum = 0;
          let finalSum = 0;
          const activePenaltiesSet = new Set();

          scores.forEach(score => {
            let scoreMap = score.scores;
            if (typeof scoreMap === 'string') {
              try { scoreMap = JSON.parse(scoreMap); } catch (e) { scoreMap = {}; }
            }
            if (!scoreMap || typeof scoreMap !== 'object') scoreMap = {};

            const criteriaScores = scoreMap.criteria || scoreMap;
            let raw = 0;
            criteriaList.forEach(crit => {
              const val = criteriaScores[crit.id] !== undefined ? criteriaScores[crit.id] : criteriaScores[crit.name];
              if (val !== undefined && val !== null && val !== "" && !isNaN(Number(val))) {
                raw += Number(val);
              }
            });
            rawSum += raw;

            let penDeduction = 0;
            const penIds = Array.isArray(scoreMap.penalties) ? scoreMap.penalties : (Array.isArray(scoreMap.__penalties) ? scoreMap.__penalties : []);
            penIds.forEach(pId => {
              const rule = penaltiesList.find(p => p.id === pId || p.name === pId);
              if (rule) {
                const ded = Number(rule.deduction) || 0;
                penDeduction += ded;
                activePenaltiesSet.add(`-${ded} (${rule.name})`);
              }
            });

            const finalScore = scoreMap.final_score !== undefined 
              ? Number(scoreMap.final_score) 
              : Math.max(0, raw - penDeduction);
            finalSum += finalScore;
          });

          const avgRaw = Number((rawSum / scores.length).toFixed(2));
          const avgFinal = Number((finalSum / scores.length).toFixed(2));
          const penaltiesText = activePenaltiesSet.size > 0 ? Array.from(activePenaltiesSet).join("; ") : "None";
          const combinedFeedback = formatCombinedFeedback(scores);

          const row = [
            `Team ${team.team_number}`,
            ...critValues,
            `${avgRaw} / ${maxScore}`,
            penaltiesText,
            `${avgFinal} / ${maxScore}`,
            String(scores.length),
            combinedFeedback
          ];
          csvLines.push(row.map(escapeCsv).join(","));
        }
      }
    } else {
      // Standard / Flat rubric (e.g. Designapalooza)
      const categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
      let totalMaxPossible = 0;
      const hasMaxScores = categories.some(c => typeof c === 'object' && c && c.max_score);
      if (hasMaxScores) {
        totalMaxPossible = categories.reduce((sum, c) => sum + (typeof c === 'object' && c.max_score ? Number(c.max_score) : 0), 0);
      }

      const headers = ["Team Number"];
      for (const cat of categories) {
        const catName = typeof cat === 'string' ? cat : cat.name;
        const maxVal = typeof cat === 'object' && cat && cat.max_score ? ` (${cat.max_score})` : "";
        headers.push(`${catName}${maxVal}`);
      }
      headers.push(
        hasMaxScores ? `Total Score (Avg) (/${totalMaxPossible})` : "Total Score (Avg)",
        "Judges Graded",
        "Feedback"
      );
      csvLines.push(headers.map(escapeCsv).join(","));

      for (const team of teams) {
        const scores = (team.Scores || []).sort((a, b) => a.id - b.id);
        if (scores.length === 0) {
          const row = [`Team ${team.team_number}`, ...categories.map(() => ""), "", "0", ""];
          csvLines.push(row.map(escapeCsv).join(","));
        } else {
          // Average each category across judges
          const catValues = categories.map(cat => {
            const catName = typeof cat === 'string' ? cat : cat.name;
            const catMax = typeof cat === 'object' && cat && cat.max_score ? cat.max_score : null;
            let sum = 0;
            let count = 0;
            scores.forEach(score => {
              let scoreMap = score.scores;
              if (typeof scoreMap === 'string') {
                try { scoreMap = JSON.parse(scoreMap); } catch (e) { scoreMap = {}; }
              }
              if (!scoreMap || typeof scoreMap !== 'object') scoreMap = {};
              const val = scoreMap[catName];
              if (val !== undefined && val !== null && val !== "" && !isNaN(Number(val))) {
                sum += Number(val);
                count++;
              }
            });
            if (count === 0) return "";
            const avg = Number((sum / count).toFixed(2));
            return catMax ? `${avg} / ${catMax}` : `${avg}`;
          });

          let totalSum = 0;
          scores.forEach(score => {
            let scoreMap = score.scores;
            if (typeof scoreMap === 'string') {
              try { scoreMap = JSON.parse(scoreMap); } catch (e) { scoreMap = {}; }
            }
            if (!scoreMap || typeof scoreMap !== 'object') scoreMap = {};
            let teamJudgeTotal = 0;
            categories.forEach(cat => {
              const catName = typeof cat === 'string' ? cat : cat.name;
              const val = scoreMap[catName];
              if (val !== undefined && val !== null && val !== "" && !isNaN(Number(val))) {
                teamJudgeTotal += Number(val);
              }
            });
            totalSum += teamJudgeTotal;
          });

          const avgTotal = Number((totalSum / scores.length).toFixed(2));
          const totalFormatted = hasMaxScores ? `${avgTotal} / ${totalMaxPossible}` : `${avgTotal}`;
          const combinedFeedback = formatCombinedFeedback(scores);

          const row = [
            `Team ${team.team_number}`,
            ...catValues,
            totalFormatted,
            String(scores.length),
            combinedFeedback
          ];
          csvLines.push(row.map(escapeCsv).join(","));
        }
      }
    }

    const safeName = competition.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${safeName}_Scores.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(csvLines.join("\r\n"));
  } catch (error) {
    console.error("Error exporting scores CSV:", error);
    res.status(500).json({ error: "Failed to export scores CSV" });
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
app.post("/competitions/:id/activate", verifyAdmin, async (req, res) => {
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
app.post("/competitions/deactivate-all", verifyAdmin, async (req, res) => {
  try {
    await Competition.update({ isActive: false }, { where: {} });
    res.json({ message: "All competitions have been deactivated. Logins are now closed." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /competitions/{id}:
 *   delete:
 *     summary: Delete a competition and all its associated data
 *     tags: [Competitions]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Competition successfully deleted
 *       404:
 *         description: Competition not found
 *       500:
 *         description: Internal server error
 */
app.delete("/competitions/:id", verifySystemToken, async (req, res) => {
  try {
    const { id } = req.params;
    const comp = await Competition.findByPk(id);
    if (!comp) return res.status(404).json({ error: "Competition not found" });

    await comp.destroy();
    res.json({ message: `Competition ${comp.name} deleted successfully` });
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
app.get("/judgeDropdown", verifyAdmin, async (req, res) => {
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
app.get("/judges/:judgeId/schedule", verifyJudge, async (req, res) => {
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
      order: [["start_time", "ASC"]],
      include: [
        {
          model: Score,
          where: { judgeId },
          required: false
        }
      ]
    });

    const room = await Room.findByPk(judge.roomId);

    const scheduleWithGrades = teams.map(t => {
      const json = t.toJSON();
      json.isGraded = json.Scores && json.Scores.length > 0;
      if (json.Scores) {
        json.Scores = json.Scores.map(s => {
          if (typeof s.scores === 'string') {
            try { s.scores = JSON.parse(s.scores); } catch (e) { s.scores = {}; }
          }
          return s;
        });
      }
      return json;
    });

    res.json({
      judgeName: judge.name,
      room: room ? room.name : null,
      schedule: scheduleWithGrades
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
app.post("/teams/:teamId/submission", verifyTeam, async (req, res) => {
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
app.get("/teams/:teamId/scores", verifyTeam, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { competitionId } = req.query;

    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    // Ensure the team is in this competition
    const team = await Team.findOne({
      where: { id: teamId, competitionId },
      include: [{
        model: Room,
        include: [{ model: Judge, attributes: ['id', 'name'] }]
      }]
    });
    if (!team) return res.status(404).json({ error: "Team not found" });

    const scores = await Score.findAll({
      where: { teamId },
      include: [{ model: Judge, attributes: ['id', 'name'] }]
    });

    const parsedScores = scores.map(s => {
      const json = s.toJSON();
      if (typeof json.scores === 'string') {
        try { json.scores = JSON.parse(json.scores); } catch (e) { json.scores = {}; }
      }
      return json;
    });

    // If caller is admin, allow grading unsubmitted judges assigned to this team
    if (req.user && req.user.role === 'admin') {
      const scoredJudgeIds = new Set(scores.map(s => s.judgeId));
      let availableJudges = team.Room?.Judges || [];

      // Fallback: if team has no room judges, look for any judges in this competition
      if (availableJudges.length === 0 && scoredJudgeIds.size === 0) {
        availableJudges = await Judge.findAll({
          where: { competitionId },
          attributes: ['id', 'name']
        });
      }

      availableJudges.forEach(j => {
        if (!scoredJudgeIds.has(j.id)) {
          parsedScores.push({
            id: `pending-${j.id}`,
            judgeId: j.id,
            teamId: Number(teamId),
            scores: {},
            feedback: '',
            isPending: true,
            Judge: { id: j.id, name: j.name || `Judge ${j.id}` }
          });
        }
      });
    }

    res.json(parsedScores);
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
// ============================================================================
// #################### JUDGE MANAGEMENT ENDPOINTS ####################
// ============================================================================

app.post("/judges", verifyAdmin, async (req, res) => {
  try {
    const { name, username, password, roomId, competitionId } = req.body;
    if (!name || !username || !password || !roomId || !competitionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existing = await Judge.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const judge = await Judge.create({ name, username, password, roomId, competitionId });
    res.json(judge);
  } catch (error) {
    console.error("Error creating judge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/judges/:id/room", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId } = req.body;
    if (!roomId) return res.status(400).json({ error: "roomId is required" });
    const judge = await Judge.findByPk(id);
    if (!judge) return res.status(404).json({ error: "Judge not found" });
    await judge.update({ roomId });
    res.json({ message: "Judge room updated", judge });
  } catch (error) {
    console.error("Error updating judge room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/judges/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const judge = await Judge.findByPk(id);
    if (!judge) return res.status(404).json({ error: "Judge not found" });
    await judge.destroy();
    res.json({ message: "Judge deleted successfully" });
  } catch (error) {
    console.error("Error deleting judge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================================================
// #################### TEAM MANAGEMENT ENDPOINTS ####################
// ============================================================================

app.post("/teams", verifyAdmin, async (req, res) => {
  try {
    const { team_number, roomId, competitionId, start_time, end_time } = req.body;
    if (!team_number || !roomId || !competitionId) {
      return res.status(400).json({ error: "team_number, roomId, and competitionId are required" });
    }

    const comp = await Competition.findByPk(competitionId);
    if (!comp) return res.status(404).json({ error: "Competition not found" });

    const room = await Room.findByPk(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const parsedNum = parseInt(team_number, 10);
    if (isNaN(parsedNum)) {
      return res.status(400).json({ error: "team_number must be a valid integer" });
    }

    // Auto-generate clean, unique username and password
    const compSlug = comp.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    let username = `team${parsedNum}_${compSlug}`;
    const existing = await Team.findOne({ where: { username } });
    if (existing) {
      username = `team${parsedNum}_${Date.now().toString().slice(-4)}`;
    }
    const password = req.body.password || "password123";

    const team = await Team.create({
      team_number: parsedNum,
      roomId,
      competitionId,
      start_time: start_time || "10:00 AM",
      end_time: end_time || "10:15 AM",
      username,
      password
    });

    res.status(201).json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/teams/:id/room", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId, start_time, end_time } = req.body;
    if (!roomId) return res.status(400).json({ error: "roomId is required" });

    const team = await Team.findByPk(id);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const room = await Room.findByPk(roomId);
    if (!room) return res.status(404).json({ error: "Target room not found" });

    const targetRoomId = parseInt(roomId, 10);
    // If team is moving to a different room, remove old scores so new room's judges grade fresh
    if (team.roomId !== targetRoomId) {
      await Score.destroy({ where: { teamId: team.id } });
    }

    const updates = { roomId: targetRoomId };
    if (start_time !== undefined) updates.start_time = start_time;
    if (end_time !== undefined) updates.end_time = end_time;

    await team.update(updates);
    res.json({ message: "Team room updated and scores reset for new room judges", team });
  } catch (error) {
    console.error("Error updating team room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/teams/:id/time", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { start_time, end_time } = req.body;
    if (!start_time || !end_time) {
      return res.status(400).json({ error: "start_time and end_time are required" });
    }

    const team = await Team.findByPk(id);
    if (!team) return res.status(404).json({ error: "Team not found" });

    await team.update({ start_time, end_time });
    res.json({ message: "Team schedule time updated", team });
  } catch (error) {
    console.error("Error updating team time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/teams/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) return res.status(404).json({ error: "Team not found" });

    await team.destroy();
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/rooms", verifyAdmin, async (req, res) => {
  try {
    const { competitionId } = req.query;
    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    const rooms = await Room.findAll({
      where: { competitionId },
      include: [
        { model: Judge, attributes: ['id', 'name', 'username'] },
        {
          model: Team,
          attributes: ['id', 'team_number', 'start_time', 'end_time', 'presentation_link'],
          include: [{ model: Score, attributes: ['id', 'judgeId', 'teamId'] }]
        }
      ],
      order: [[Team, 'start_time', 'ASC']]
    });

    const roomsData = rooms.map(r => {
      const validJudges = (r.Judges || []).filter(j => j.name && j.name !== "NO JUDGE");
      const totalJudges = validJudges.length;

      return {
        id: r.id,
        room: r.name,
        judges: r.Judges.map(j => ({ id: j.id, name: j.name, username: j.username })),
        teams: r.Teams.map(t => {
          const scoresCount = t.Scores ? t.Scores.length : 0;
          const isGraded = scoresCount > 0;
          const isFullyGraded = scoresCount >= (totalJudges > 0 ? totalJudges : 1);

          return {
            id: t.id,
            team_number: t.team_number,
            start_time: t.start_time,
            end_time: t.end_time,
            presentation_link: t.presentation_link,
            isGraded,
            isFullyGraded,
            gradedCount: scoresCount,
            totalJudges
          };
        })
      };
    });

    // Natural numeric sorting so Room 1, Room 2, ..., Room 9, Room 10 appear in sequence
    roomsData.sort((a, b) =>
      String(a.room).localeCompare(String(b.room), undefined, { numeric: true, sensitivity: 'base' })
    );

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
app.get("/rooms/:roomId/teams", verifyAdmin, async (req, res) => {
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
app.post("/judge", verifyJudge, async (req, res) => {
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
    const scoreJson = existing.toJSON();
    if (typeof scoreJson.scores === 'string') {
      try { scoreJson.scores = JSON.parse(scoreJson.scores); } catch (e) { scoreJson.scores = {}; }
    }
    return res.json({ message: "Scores updated", score: scoreJson, existing: scoreJson });
  }

  // otherwise create a new score entry
  const score = await Score.create({
    judgeId: judge.id,
    teamId: team.id,
    scores,
    feedback
  });

  const scoreJson = score.toJSON();
  if (typeof scoreJson.scores === 'string') {
    try { scoreJson.scores = JSON.parse(scoreJson.scores); } catch (e) { scoreJson.scores = {}; }
  }

  res.json({ message: "New scores submitted", score: scoreJson });
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
app.get("/scores/:judgeId/:teamId", verifyJudge, async (req, res) => {
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

  const scoreJson = score.toJSON();
  if (typeof scoreJson.scores === 'string') {
    try { scoreJson.scores = JSON.parse(scoreJson.scores); } catch (e) { scoreJson.scores = {}; }
  }

  res.json({ previousScores: scoreJson });
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
app.get("/scores", verifyAdmin, async (req, res) => {
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

    const parsedScores = scores.map(s => {
      const json = s.toJSON();
      if (typeof json.scores === 'string') {
        try { json.scores = JSON.parse(json.scores); } catch (e) { json.scores = {}; }
      }
      return json;
    });

    res.json(parsedScores);
  } catch (error) {
    console.error("Error fetching leaderboard scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================================================
// #################### LEADERBOARD ENDPOINTS ####################
// ============================================================================

app.get("/leaderboard", verifyAdmin, async (req, res) => {
  try {
    const { competitionId } = req.query;
    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    const sortedLeaderboard = await getLeaderboardData(competitionId);
    res.json(sortedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/leaderboard/export", verifyAdmin, async (req, res) => {
  try {
    const { competitionId } = req.query;
    if (!competitionId) return res.status(400).json({ error: "competitionId required" });

    // Fetch the competition for the title
    const competition = await Competition.findByPk(competitionId);
    if (!competition) return res.status(404).json({ error: "Competition not found" });

    const sortedLeaderboard = await getLeaderboardData(competitionId);
    
    // Create CSV String - Pure tabular data without metadata rows for clean parsing
    let csv = "Rank,Team,Score (Avg),Raw Total,Judges Graded,Status\n";
    
    sortedLeaderboard.forEach((team, index) => {
      const totalJudges = Math.max(team.total_judges || 0, team.judges_counted || 1);
      const status = team.is_fully_graded ? "Fully Graded" : `In Progress (${team.judges_counted}/${totalJudges})`;
      csv += `${index + 1},Team ${team.team_number},${team.total_score},${team.raw_score_sum !== undefined ? team.raw_score_sum : team.total_score},${team.judges_counted}/${totalJudges},${status}\n`;
    });

    const safeFileName = competition.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}_results.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
