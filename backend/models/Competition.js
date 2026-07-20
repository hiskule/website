// models/Competition.js
module.exports = (sequelize, DataTypes) => {
  const Competition = sequelize.define("Competition", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY, // E.g., '2023-11-20'
      allowNull: true,
    },
    categories: {
      type: DataTypes.JSON, // E.g., ["Design", "Presentation", "Execution"]
      allowNull: false,
      defaultValue: [],
    },
  });

  return Competition;
};
