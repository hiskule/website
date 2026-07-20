const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const JudgeModel = require("./Judge.js");
const TeamModel = require("./Team.js");
const ScoreModel = require("./Score.js");

// Initialize models
const Judge = JudgeModel(sequelize, DataTypes);
const Team = TeamModel(sequelize, DataTypes);
const Score = ScoreModel(sequelize, DataTypes);

Judge.hasMany(Score, { foreignKey: "judgeId" });
Score.belongsTo(Judge, { foreignKey: "judgeId" });

Team.hasMany(Score, { foreignKey: "teamId" });
Score.belongsTo(Team, { foreignKey: "teamId" });

module.exports = { sequelize, Judge, Team, Score };
