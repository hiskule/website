"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HelpRequests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      competitionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Competitions", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      judgeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Judges", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      judgeName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Rooms", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      roomName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      resolvedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      resolvedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("HelpRequests");
  },
};
