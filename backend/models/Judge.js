// models/Judge.js
module.exports = (sequelize, DataTypes) => {
  const Judge = sequelize.define("Judge", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: true, // Some judges might not be assigned a room yet
    },
  });

  return Judge;
};

