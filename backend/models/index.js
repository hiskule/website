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
  const RoomModel = require("./Room.js");
  const JudgeModel = require("./Judge.js");
  const TeamModel = require("./Team.js");
  const ScoreModel = require("./Score.js");

  // Initialize models
  Competition = CompetitionModel(sequelize, DataTypes);
  Room = RoomModel(sequelize, DataTypes);
  Judge = JudgeModel(sequelize, DataTypes);
  Team = TeamModel(sequelize, DataTypes);
  Score = ScoreModel(sequelize, DataTypes);

  // Competition relationships
  Competition.hasMany(Room, { foreignKey: "competitionId", onDelete: 'CASCADE' });
  Room.belongsTo(Competition, { foreignKey: "competitionId" });

  Competition.hasMany(Judge, { foreignKey: "competitionId", onDelete: 'CASCADE' });
  Judge.belongsTo(Competition, { foreignKey: "competitionId" });

  Competition.hasMany(Team, { foreignKey: "competitionId", onDelete: 'CASCADE' });
  Team.belongsTo(Competition, { foreignKey: "competitionId" });

  // Room relationships
  Room.hasMany(Judge, { foreignKey: "roomId", onDelete: 'CASCADE' });
  Judge.belongsTo(Room, { foreignKey: "roomId" });

  Room.hasMany(Team, { foreignKey: "roomId", onDelete: 'CASCADE' });
  Team.belongsTo(Room, { foreignKey: "roomId" });

  // Score relationships
  Judge.hasMany(Score, { foreignKey: "judgeId", onDelete: 'CASCADE' });
  Score.belongsTo(Judge, { foreignKey: "judgeId" });

  Team.hasMany(Score, { foreignKey: "teamId", onDelete: 'CASCADE' });
  Score.belongsTo(Team, { foreignKey: "teamId" });

} catch (error) {
  dbError = error.stack || error.message || String(error);
}

module.exports = { sequelize, Competition, Room, Judge, Team, Score, dbError };

