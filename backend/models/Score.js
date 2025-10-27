// models/Score.js
export default (sequelize, DataTypes) => {
  const Score = sequelize.define("Score", {
    category1: DataTypes.INTEGER,
    category2: DataTypes.INTEGER,
    category3: DataTypes.INTEGER,
    category4: DataTypes.INTEGER,
    category5: DataTypes.INTEGER,
  });

  return Score;
};
