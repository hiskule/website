// models/Judge.js
module.exports = (sequelize, DataTypes) => {
  const Judge = sequelize.define("Judge", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Judge;
};

