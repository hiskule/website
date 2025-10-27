// models/Judge.js
export default (sequelize, DataTypes) => {
  const Judge = sequelize.define("Judge", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Judge;
};

