const { Score, Team, Judge, Competition, Room } = require('../models');

async function getLeaderboardData(competitionId) {
  const comp = await Competition.findByPk(competitionId);
  let compCats = comp ? comp.categories : null;
  if (typeof compCats === 'string') {
    try { compCats = JSON.parse(compCats); } catch (e) { compCats = null; }
  }

  // Fetch all judges and teams in the competition first, including room assignment
  const judges = await Judge.findAll({ where: { competitionId } });
  const teams = await Team.findAll({
    where: { competitionId },
    include: [
      {
        model: Room,
        include: [
          {
            model: Judge,
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  });

  const judgeIds = judges.map(j => j.id);
  const teamIds = teams.map(t => t.id);

  // Map team_number -> expected total judges assigned to that team's room
  const teamMetaMap = {};
  teams.forEach(t => {
    const validJudges = ((t.Room && t.Room.Judges) || []).filter(j => j.name && j.name !== "NO JUDGE");
    const totalJudges = validJudges.length > 0 ? validJudges.length : 1;
    teamMetaMap[t.team_number] = {
      team_id: t.id,
      team_number: t.team_number,
      total_judges: totalJudges
    };
  });

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
    if (!s.Team) return;
    const teamNum = s.Team.team_number;
    const meta = teamMetaMap[teamNum] || { total_judges: 1 };
    if (!teamScoresMap[teamNum]) {
      teamScoresMap[teamNum] = {
        team_number: teamNum,
        raw_score_sum: 0,
        judges_counted: 0,
        total_judges: meta.total_judges
      };
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

    teamScoresMap[teamNum].raw_score_sum += finalScore;
    teamScoresMap[teamNum].judges_counted += 1;
  });

  // Calculate average scores and grading status
  const leaderboard = Object.values(teamScoresMap).map(entry => {
    const totalJudges = Math.max(entry.total_judges || 1, entry.judges_counted);
    const avgScore = entry.judges_counted > 0 
      ? Number((entry.raw_score_sum / entry.judges_counted).toFixed(2))
      : 0;
    const isFullyGraded = entry.judges_counted >= totalJudges;

    return {
      team_number: entry.team_number,
      total_score: avgScore, // Average score kept as total_score for compatibility
      average_score: avgScore,
      raw_score_sum: Number(entry.raw_score_sum.toFixed(2)),
      judges_counted: entry.judges_counted,
      total_judges: totalJudges,
      is_fully_graded: isFullyGraded
    };
  });

  // Sort by average score descending; if tied, fully graded first, then team number ascending
  leaderboard.sort((a, b) => {
    if (b.total_score !== a.total_score) {
      return b.total_score - a.total_score;
    }
    if (b.is_fully_graded !== a.is_fully_graded) {
      return (b.is_fully_graded ? 1 : 0) - (a.is_fully_graded ? 1 : 0);
    }
    return a.team_number - b.team_number;
  });

  return leaderboard;
}

module.exports = {
  getLeaderboardData
};
