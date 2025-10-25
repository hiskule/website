import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import config from "../config/config.js";
dotenv.config();

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const Judge = JudgeModel(sequelize);
const Team = TeamModel(sequelize);
const Category = CategoryModel(sequelize);
const Score = ScoreModel(sequelize);

// Relationships
Judge.hasMany(Score, { foreignKey: "judgeId" });
Score.belongsTo(Judge, { foreignKey: "judgeId" });

Team.hasMany(Score, { foreignKey: "teamId" });
Score.belongsTo(Team, { foreignKey: "teamId" });

Category.hasMany(Score, { foreignKey: "categoryId" });
Score.belongsTo(Category, { foreignKey: "categoryId" });

export { sequelize, Judge, Team, Category, Score };
