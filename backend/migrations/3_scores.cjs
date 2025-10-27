"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Scores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judgeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Judges", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      teamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Teams", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category1: { type: Sequelize.INTEGER, allowNull: true },
      category2: { type: Sequelize.INTEGER, allowNull: true },
      category3: { type: Sequelize.INTEGER, allowNull: true },
      category4: { type: Sequelize.INTEGER, allowNull: true },
      category5: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Scores");
  },
};
