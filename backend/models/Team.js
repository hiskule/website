// models/Team.js
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define("Team", {
    team_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time_slot: {
      type: DataTypes.STRING, // e.g. "10:30 AM"
      allowNull: true,
    },
  });

  return Team;
};
