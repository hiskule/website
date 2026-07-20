// models/Team.js
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define("Team", {
    team_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Team;
};
