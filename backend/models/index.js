import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

import JudgeModel from "./Judge.js";
import TeamModel from "./Team.js";
import ScoreModel from "./Score.js";

// Initialize models
const Judge = JudgeModel(sequelize, DataTypes);
const Team = TeamModel(sequelize, DataTypes);
const Score = ScoreModel(sequelize, DataTypes);

Judge.hasMany(Score, { foreignKey: "judgeId" });
Score.belongsTo(Judge, { foreignKey: "judgeId" });

Team.hasMany(Score, { foreignKey: "teamId" });
Score.belongsTo(Team, { foreignKey: "teamId" });

export { sequelize, Judge, Team, Score };
