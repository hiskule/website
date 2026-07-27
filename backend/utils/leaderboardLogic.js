const { Score, Team, Judge } = require('../models');

async function getLeaderboardData(competitionId) {
  // Fetch all judges and teams in the competition first
  const judges = await Judge.findAll({ where: { competitionId } });
  const teams = await Team.findAll({ where: { competitionId } });

  const judgeIds = judges.map(j => j.id);
  const teamIds = teams.map(t => t.id);

  // Fetch scores that belong to these judges and teams
  const scores = await Score.findAll({
    where: {
      judgeId: judgeIds,
      teamId: teamIds
    },
    include: [
      { model: Judge, attributes: ['name'] },
      { model: Team, attributes: ['team_number'] }
    ]
  });

  // Aggregate scores by team
  const teamScoresMap = {};

  scores.forEach(s => {
    const teamNum = s.Team.team_number;
    if (!teamScoresMap[teamNum]) {
      teamScoresMap[teamNum] = { team_number: teamNum, total_score: 0, judges_counted: 0 };
    }
    
    let parsedScores = s.scores || {};
    if (typeof parsedScores === 'string') {
      try {
        parsedScores = JSON.parse(parsedScores);
      } catch (e) {
        parsedScores = {};
      }
    }
    
    const sTotal = Object.values(parsedScores).reduce((sum, val) => sum + Number(val), 0);
    teamScoresMap[teamNum].total_score += sTotal;
    teamScoresMap[teamNum].judges_counted += 1;
  });

  // Sort by total score descending
  const sorted = Object.values(teamScoresMap).sort((a, b) => b.total_score - a.total_score);

  return sorted;
}

module.exports = {
  getLeaderboardData
};
