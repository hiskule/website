const fs = require('fs');
const path = require('path');
const { sequelize, Competition, Judge, Team } = require('../models/index.js');

async function seedData() {
  try {
    console.log("Loading competitions.json...");
    const competitionsPath = path.join(__dirname, '../data/competitions.json');
    const competitionsData = JSON.parse(fs.readFileSync(competitionsPath, 'utf-8'));

    console.log("Connecting to Database...");
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Wipe db clean before seeding

    for (const compData of competitionsData) {
      console.log(`Creating Competition: ${compData.name}...`);
      const comp = await Competition.create({
        name: compData.name,
        date: compData.date || new Date(),
        categories: compData.categories || []
      });

      console.log(`Seeding ${compData.judges?.length || 0} Judges...`);
      for (const j of (compData.judges || [])) {
        await Judge.create({
          name: j.name,
          room: j.room || null,
          competitionId: comp.id
        });
      }

      console.log(`Seeding ${compData.teams?.length || 0} Teams...`);
      for (const t of (compData.teams || [])) {
        await Team.create({
          team_number: t.team_number,
          room: t.room,
          time_slot: t.time_slot || "10:00 AM",
          competitionId: comp.id
        });
      }
    }

    console.log("✅ Successfully seeded database with complete logistics!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedData();
