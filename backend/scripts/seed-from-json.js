const fs = require('fs');
const path = require('path');
const { sequelize, Competition, Room, Judge, Team } = require('../models/index.js');
const { Op } = require('sequelize');

async function seedData() {
  try {
    // Get file from command line arguments, default to competitions.json
    const fileName = process.argv[2] || 'data/competitions.json';
    console.log(`Loading ${fileName}...`);
    
    // Resolve path from the backend root
    const competitionsPath = path.resolve(__dirname, '..', fileName);
    
    if (!fs.existsSync(competitionsPath)) {
      throw new Error(`File not found: ${competitionsPath}`);
    }
    
    const competitionsData = JSON.parse(fs.readFileSync(competitionsPath, 'utf-8'));

    console.log("Connecting to Database...");
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Wipe db clean before seeding

    for (const compData of competitionsData) {
      console.log(`Creating Competition: ${compData.name}...`);
      const comp = await Competition.create({
        name: compData.name,
        isActive: compData.isActive || false,
        date: compData.date || new Date(),
        categories: compData.categories || []
      });

      console.log(`Creating Rooms for ${compData.name}...`);
      const uniqueRooms = new Set();
      (compData.judges || []).forEach(j => { if (j.room) uniqueRooms.add(j.room); });
      (compData.teams || []).forEach(t => { if (t.room) uniqueRooms.add(t.room); });

      const roomMap = {};
      for (const roomName of uniqueRooms) {
        const room = await Room.create({ name: roomName, competitionId: comp.id });
        roomMap[roomName] = room.id;
      }

      console.log(`Seeding ${compData.judges?.length || 0} Judges...`);
      for (const j of (compData.judges || [])) {
        await Judge.create({
          name: j.name,
          roomId: roomMap[j.room] || null,
          username: j.username,
          password: j.password,
          competitionId: comp.id
        });
      }

      console.log(`Seeding ${compData.teams?.length || 0} Teams...`);
      for (const t of (compData.teams || [])) {
        await Team.create({
          team_number: t.team_number,
          roomId: roomMap[t.room] || null,
          start_time: t.start_time,
          end_time: t.end_time,
          username: t.username,
          password: t.password,
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
