import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

interface LeaderboardProps {
  competitionId: number;
}

interface Score {
  id: number;
  total_score: number;
  Team: { team_number: number };
}

interface TeamScore {
  team_number: number;
  total_score: number;
  judges_counted: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ competitionId }) => {
  const [leaderboard, setLeaderboard] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchScores();
  }, [competitionId]);

  const fetchScores = async () => {
    try {
      const res = await fetch(`${API_URL}/scores?competitionId=${competitionId}`);
      if (res.ok) {
        const scores: Score[] = await res.json();
        
        // Aggregate scores by team
        const teamScoresMap: Record<number, TeamScore> = {};
        
        scores.forEach(s => {
          const teamNum = s.Team.team_number;
          if (!teamScoresMap[teamNum]) {
            teamScoresMap[teamNum] = { team_number: teamNum, total_score: 0, judges_counted: 0 };
          }
          teamScoresMap[teamNum].total_score += s.total_score;
          teamScoresMap[teamNum].judges_counted += 1;
        });

        // Calculate averages and sort descending
        const sorted = Object.values(teamScoresMap).map(ts => ({
          ...ts,
          average_score: ts.total_score / ts.judges_counted
        })).sort((a, b) => b.average_score - a.average_score);

        setLeaderboard(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <section className="leaderboard-section">
      <div className="leaderboard-header">
        <h3 className="text-headline-md">Live Leaderboard</h3>
      </div>
      
      <div className="glass-card leaderboard-table-wrapper">
        {leaderboard.length > 0 ? (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Avg Score</th>
                <th>Judges Graded</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((team, idx) => (
                <tr key={team.team_number}>
                  <td className="rank-col">#{idx + 1}</td>
                  <td className="team-col">Team {team.team_number}</td>
                  <td>{team.average_score.toFixed(2)}</td>
                  <td>{team.judges_counted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="leaderboard-empty">No scores submitted yet.</p>
        )}
      </div>
    </section>
  );
};
