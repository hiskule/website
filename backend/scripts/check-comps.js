const { sequelize, Competition } = require('../models/index.js');

async function checkCompetitions() {
  const comps = await Competition.findAll();
  console.log("Competitions in DB:", JSON.stringify(comps.map(c => ({
    id: c.id,
    name: c.name,
    isActive: c.isActive
  })), null, 2));
  process.exit(0);
}

checkCompetitions();
