// models/Judge.js
module.exports = (sequelize, DataTypes) => {
  const Judge = sequelize.define("Judge", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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

  return Judge;
};

