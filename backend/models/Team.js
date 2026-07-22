// models/Team.js
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define("Team", {
    team_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    presentation_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    team_comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submission_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Team;
};
