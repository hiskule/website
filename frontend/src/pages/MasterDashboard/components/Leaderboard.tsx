import React, { useEffect, useState } from 'react';
import { request } from '../../../shared/api/http';
import './Leaderboard.css';

interface LeaderboardProps {
  competitionId: number;
}

interface TeamScore {
  team_number: number;
  total_score: number;
  judges_counted: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ competitionId }) => {
  const [leaderboard, setLeaderboard] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [competitionId]);

  const fetchLeaderboard = async () => {
    try {
      const sorted = await request<TeamScore[]>(`/leaderboard?competitionId=${competitionId}`);
      setLeaderboard(sorted);
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
                <th>Total Score</th>
                <th>Judges Graded</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((team, idx) => (
                <tr key={team.team_number}>
                  <td className="rank-col">#{idx + 1}</td>
                  <td className="team-col">Team {team.team_number}</td>
                  <td>{team.total_score}</td>
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
