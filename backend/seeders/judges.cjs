"use strict";
const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const judges = JSON.parse(fs.readFileSync("./data/judges.json", "utf8"));
    await queryInterface.bulkInsert(
      "Judges",
      judges.map((j) => ({
        name: j.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Judges", null, {});
  },
};
