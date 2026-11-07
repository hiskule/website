const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

let Competition, Room, Judge, Team, Score, HelpRequest, sequelize;
let dbError = null;

try {
  const sequelizeOptions = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: "mysql",
    pool: {
      max: 30,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
  };

  if (process.env.DB_SOCKET) {
    sequelizeOptions.dialectOptions = {
      socketPath: process.env.DB_SOCKET,
    };
  }

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    sequelizeOptions
  );

  const CompetitionModel = require("./Competition.js");
  const RoomModel = require("./Room.js");
  const JudgeModel = require("./Judge.js");
  const TeamModel = require("./Team.js");
  const ScoreModel = require("./Score.js");
  const HelpRequestModel = require("./HelpRequest.js");

  // Initialize models
  Competition = CompetitionModel(sequelize, DataTypes);
  Room = RoomModel(sequelize, DataTypes);
  Judge = JudgeModel(sequelize, DataTypes);
  Team = TeamModel(sequelize, DataTypes);
  Score = ScoreModel(sequelize, DataTypes);
  HelpRequest = HelpRequestModel(sequelize, DataTypes);

  // Competition relationships
  Competition.hasMany(Room, { foreignKey: "competitionId", onDelete: 'CASCADE' });
  Room.belongsTo(Competition, { foreignKey: "competitionId" });

  Competition.hasMany(Judge, { foreignKey: "competitionId", onDelete: 'CASCADE' });
  Judge.belongsTo(Competition, { foreignKey: "competitionId" });

  Competition.hasMany(Team, { foreignKey: "competitionId", onDelete: 'CASCADE' });
  Team.belongsTo(Competition, { foreignKey: "competitionId" });

  Competition.hasMany(HelpRequest, { foreignKey: "competitionId", onDelete: 'CASCADE' });
  HelpRequest.belongsTo(Competition, { foreignKey: "competitionId" });

  // Room relationships
  Room.hasMany(Judge, { foreignKey: "roomId", onDelete: 'CASCADE' });
  Judge.belongsTo(Room, { foreignKey: "roomId" });

  Room.hasMany(Team, { foreignKey: "roomId", onDelete: 'CASCADE' });
  Team.belongsTo(Room, { foreignKey: "roomId" });

  Room.hasMany(HelpRequest, { foreignKey: "roomId", onDelete: 'SET NULL' });
  HelpRequest.belongsTo(Room, { foreignKey: "roomId" });

  // Score relationships
  Judge.hasMany(Score, { foreignKey: "judgeId", onDelete: 'CASCADE' });
  Score.belongsTo(Judge, { foreignKey: "judgeId" });

  Team.hasMany(Score, { foreignKey: "teamId", onDelete: 'CASCADE' });
  Score.belongsTo(Team, { foreignKey: "teamId" });

  // Judge help relationships
  Judge.hasMany(HelpRequest, { foreignKey: "judgeId", onDelete: 'CASCADE' });
  HelpRequest.belongsTo(Judge, { foreignKey: "judgeId" });

} catch (error) {
  dbError = error.stack || error.message || String(error);
}

module.exports = { sequelize, Competition, Room, Judge, Team, Score, HelpRequest, dbError };

