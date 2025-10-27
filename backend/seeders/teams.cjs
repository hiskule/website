"use strict";
const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const teams = JSON.parse(fs.readFileSync("./data/teams.json", "utf8"));
    await queryInterface.bulkInsert(
      "Teams",
      teams.map((t) => ({
        team_number: t.team_number,
        room: t.room,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Teams", null, {});
  },
};
