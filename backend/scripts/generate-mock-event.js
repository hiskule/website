// scripts/generate-mock-event.js
// Generates test run dataset matching the official UTHSDC 2026 schedule and judges.
const fs = require('fs');
const path = require('path');

const EVENT_NAME = "UTHSDC 2026 (Test Run)";

const uthsdcTemplate = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'uthsdc-2026.json'), 'utf-8'));
const comp = uthsdcTemplate[0];

const mockCompetition = [
  {
    name: EVENT_NAME,
    isActive: true,
    date: comp.date || "2026-11-07",
    categories: comp.categories,
    judges: comp.judges,
    teams: comp.teams
  }
];

const outputPath = path.resolve(__dirname, '..', 'data', 'uthsdc-test-15j.json');
fs.writeFileSync(outputPath, JSON.stringify(mockCompetition, null, 2), 'utf-8');

console.log(`Generated test event: ${outputPath}`);
console.log(`Judges: ${comp.judges.length}, Teams: ${comp.teams.length}`);

