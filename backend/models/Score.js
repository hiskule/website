// models/Score.js
module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define("Score", {
    scores: {
      type: DataTypes.JSON, // E.g. {"Design": 10, "Presentation": 8}
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });

  return Score;
};
