const { Score, Team, Judge, Competition } = require('../models');

async function getLeaderboardData(competitionId) {
  const comp = await Competition.findByPk(competitionId);
  let compCats = comp ? comp.categories : null;
  if (typeof compCats === 'string') {
    try { compCats = JSON.parse(compCats); } catch (e) { compCats = null; }
  }

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
    
    let finalScore = 0;
    if (parsedScores.final_score !== undefined && !isNaN(Number(parsedScores.final_score))) {
      finalScore = Number(parsedScores.final_score);
    } else if (parsedScores.criteria && typeof parsedScores.criteria === 'object') {
      let raw = 0;
      Object.values(parsedScores.criteria).forEach(v => {
        const num = Number(v);
        if (!isNaN(num)) raw += num;
      });
      let penDeductions = 0;
      const penaltyRules = (compCats && compCats.penalties) || [];
      if (Array.isArray(parsedScores.penalties)) {
        parsedScores.penalties.forEach(pId => {
          const rule = penaltyRules.find(p => p.id === pId || p.name === pId);
          if (rule) penDeductions += Number(rule.deduction) || 0;
        });
      }
      finalScore = Math.max(0, raw - penDeductions);
    } else {
      let sum = 0;
      Object.entries(parsedScores).forEach(([k, v]) => {
        if (!k.startsWith('__')) {
          const num = Number(v);
          if (!isNaN(num)) sum += num;
        }
      });
      finalScore = sum;
    }

    teamScoresMap[teamNum].total_score += finalScore;
    teamScoresMap[teamNum].judges_counted += 1;
  });

  // Sort by total score descending
  const sorted = Object.values(teamScoresMap).sort((a, b) => b.total_score - a.total_score);

  return sorted;
}

module.exports = {
  getLeaderboardData
};
