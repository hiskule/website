const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

let Competition, Judge, Team, Score, sequelize;
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

  const CompetitionModel = require("./Competition.js");
  const JudgeModel = require("./Judge.js");
  const TeamModel = require("./Team.js");
  const ScoreModel = require("./Score.js");

  // Initialize models
  Competition = CompetitionModel(sequelize, DataTypes);
  Judge = JudgeModel(sequelize, DataTypes);
  Team = TeamModel(sequelize, DataTypes);
  Score = ScoreModel(sequelize, DataTypes);

  // Competition relationships
  Competition.hasMany(Judge, { foreignKey: "competitionId", onDelete: 'CASCADE' });
  Judge.belongsTo(Competition, { foreignKey: "competitionId" });

  Competition.hasMany(Team, { foreignKey: "competitionId", onDelete: 'CASCADE' });
  Team.belongsTo(Competition, { foreignKey: "competitionId" });

  // Score relationships
  Judge.hasMany(Score, { foreignKey: "judgeId", onDelete: 'CASCADE' });
  Score.belongsTo(Judge, { foreignKey: "judgeId" });

  Team.hasMany(Score, { foreignKey: "teamId", onDelete: 'CASCADE' });
  Score.belongsTo(Team, { foreignKey: "teamId" });

} catch (error) {
  dbError = error.stack || error.message || String(error);
}

module.exports = { sequelize, Competition, Judge, Team, Score, dbError };

