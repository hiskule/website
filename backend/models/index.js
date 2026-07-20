const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

let Judge, Team, Score, sequelize;
let dbError = null;

try {
  sequelize = new Sequelize(
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
  Judge = JudgeModel(sequelize, DataTypes);
  Team = TeamModel(sequelize, DataTypes);
  Score = ScoreModel(sequelize, DataTypes);

  Judge.hasMany(Score, { foreignKey: "judgeId" });
  Score.belongsTo(Judge, { foreignKey: "judgeId" });

  Team.hasMany(Score, { foreignKey: "teamId" });
  Score.belongsTo(Team, { foreignKey: "teamId" });
} catch (error) {
  dbError = error.stack || error.message || String(error);
}

module.exports = { sequelize, Judge, Team, Score, dbError };

