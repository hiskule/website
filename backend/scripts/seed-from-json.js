const fs = require('fs');
const path = require('path');
const { sequelize, Competition, Room, Judge, Team, HelpRequest } = require('../models/index.js');
const { Op } = require('sequelize');

async function seedData() {
  try {
    // Get file from command line arguments, default to uthsdc-2026.json
    const fileName = process.argv[2] || 'data/uthsdc-2026.json';
    console.log(`Loading ${fileName}...`);
    
    // Resolve path from the backend root
    const competitionsPath = path.resolve(__dirname, '..', fileName);
    
    if (!fs.existsSync(competitionsPath)) {
      throw new Error(`File not found: ${competitionsPath}`);
    }
    
    const competitionsData = JSON.parse(fs.readFileSync(competitionsPath, 'utf-8'));

    console.log("Connecting to Database...");
    await sequelize.authenticate();
    await sequelize.sync(); // Ensure tables exist without dropping other competitions

    const { Score } = require('../models/index.js');

    for (const compData of competitionsData) {
      console.log(`Checking existing competition: ${compData.name}...`);
      const existingComp = await Competition.findOne({ where: { name: compData.name } });
      if (existingComp) {
        console.log(`Cleaning up old data for ${compData.name}...`);
        const oldTeams = await Team.findAll({ where: { competitionId: existingComp.id } });
        const oldJudges = await Judge.findAll({ where: { competitionId: existingComp.id } });
        const teamIds = oldTeams.map(t => t.id);
        const judgeIds = oldJudges.map(j => j.id);

        if (teamIds.length > 0 && Score) await Score.destroy({ where: { teamId: teamIds } });
        if (judgeIds.length > 0 && Score) await Score.destroy({ where: { judgeId: judgeIds } });
        if (HelpRequest) {
          try {
            await HelpRequest.destroy({ where: { competitionId: existingComp.id } });
          } catch (e) {}
        }

        await Team.destroy({ where: { competitionId: existingComp.id } });
        await Judge.destroy({ where: { competitionId: existingComp.id } });
        await Room.destroy({ where: { competitionId: existingComp.id } });
        await existingComp.destroy();
      }

      if (compData.isActive) {
        await Competition.update({ isActive: false }, { where: {} });
      }

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
