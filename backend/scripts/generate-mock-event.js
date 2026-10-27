// scripts/generate-mock-event.js
// Generates a mock competition dataset with configurable judges and teams per room.
const fs = require('fs');
const path = require('path');

const NUM_ROOMS = 15;
const TEAMS_PER_ROOM = 6;
const EVENT_NAME = "UTHSDC 2026 (Test Run)"; // Creates a separate event alongside the official one

const timeSlots = [
  { start: "10:00 AM", end: "10:15 AM" },
  { start: "10:15 AM", end: "10:30 AM" },
  { start: "10:30 AM", end: "10:45 AM" },
  { start: "10:45 AM", end: "11:00 AM" },
  { start: "11:00 AM", end: "11:15 AM" },
  { start: "11:15 AM", end: "11:30 AM" }
];

const categories = [
  {
    name: "Engineering Design Process",
    description: "Did the team use engineering techniques during their design process?",
    max_score: 10
  },
  {
    name: "Aesthetics/Realism",
    description: "Is this a practical solution? Is the solution viable?",
    max_score: 5
  },
  {
    name: "Coolness/uniqueness",
    description: "Is the solution creative?",
    max_score: 5
  },
  {
    name: "Presentation",
    description: "Did the team articulate clearly? Did they respond well to questions?",
    max_score: 5
  }
];

const judges = [];
const teams = [];
let teamCounter = 1;

for (let r = 1; r <= NUM_ROOMS; r++) {
  const roomName = `Room ${r}`;
  
  // 1 Judge per room
  judges.push({
    name: `Judge ${r}`,
    room: roomName,
    username: `judge${r}_uthsdc_26`,
    password: "password123"
  });

  // 6 Teams per room
  for (let s = 0; s < TEAMS_PER_ROOM; s++) {
    const slot = timeSlots[s % timeSlots.length];
    teams.push({
      team_number: teamCounter,
      room: roomName,
      start_time: slot.start,
      end_time: slot.end,
      username: `team${teamCounter}_uthsdc_26`,
      password: "password123"
    });
    teamCounter++;
  }
}

const mockCompetition = [
  {
    name: EVENT_NAME,
    isActive: true,
    date: "2026-11-07",
    categories,
    judges,
    teams
  }
];

const outputPath = path.resolve(__dirname, '..', 'data', 'uthsdc-test-15j.json');
fs.writeFileSync(outputPath, JSON.stringify(mockCompetition, null, 2), 'utf-8');

console.log(`Generated mock event: ${outputPath}`);
console.log(`Rooms: ${NUM_ROOMS}, Judges: ${judges.length}, Teams: ${teams.length}`);
