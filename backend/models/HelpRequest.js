// models/HelpRequest.js
module.exports = (sequelize, DataTypes) => {
  const HelpRequest = sequelize.define("HelpRequest", {
    competitionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    judgeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    judgeName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending", // 'pending' | 'resolved' | 'cancelled'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resolvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return HelpRequest;
};
