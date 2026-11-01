import React, { useEffect, useState, useCallback } from 'react';
import { request } from '../../../shared/api/http';
import './Leaderboard.css';

interface LeaderboardProps {
  competitionId: number;
  refreshTrigger?: number;
  onRefresh?: () => void;
}

interface TeamScore {
  team_number: number;
  total_score: number;
  average_score?: number;
  raw_score_sum?: number;
  judges_counted: number;
  total_judges?: number;
  is_fully_graded?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ competitionId, refreshTrigger, onRefresh }) => {
  const [leaderboard, setLeaderboard] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchLeaderboard = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const sorted = await request<TeamScore[]>(`/leaderboard?competitionId=${competitionId}`);
      setLeaderboard(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, [competitionId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [competitionId, refreshTrigger, fetchLeaderboard]);

  // Periodic polling every 20 seconds so admin sees live scores and room statuses from judges automatically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaderboard();
      if (onRefresh) onRefresh();
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard, onRefresh]);

  const handleManualRefresh = () => {
    fetchLeaderboard(true);
    if (onRefresh) onRefresh();
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('hiskule_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/leaderboard/export?competitionId=${competitionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to export CSV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cd = res.headers.get('Content-Disposition');
      let filename = 'leaderboard_results.csv';
      if (cd && cd.includes('filename="')) {
        filename = cd.split('filename="')[1].split('"')[0];
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting leaderboard CSV:', err);
      alert(`Failed to export: ${err instanceof Error ? err.message : 'Network error'}`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <section className="leaderboard-section">
      <div className="leaderboard-header">
        <div className="leaderboard-header-left">
          <h3 className="text-headline-md">Live Leaderboard</h3>
          <span className="leaderboard-subhead">
            Weighted by judge count (Average score)
          </span>
        </div>
        <div className="leaderboard-header-actions">
          <button 
            onClick={handleExportCSV}
            className="leaderboard-export-btn"
            disabled={exporting || leaderboard.length === 0}
            title="Export leaderboard ranking as CSV"
          >
            {exporting ? 'Exporting...' : 'Export Leaderboard (CSV)'}
          </button>
          <button 
            onClick={handleManualRefresh} 
            className="leaderboard-refresh-btn"
            disabled={refreshing}
            title="Refresh leaderboard and room status"
          >
            {refreshing ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      <div className="glass-card leaderboard-table-wrapper">
        {leaderboard.length > 0 ? (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Team</th>
                <th>Score (Avg)</th>
                <th>Grading Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((team, idx) => {
                const totalJudges = Math.max(team.total_judges || 0, team.judges_counted || 1);
                const isFullyGraded = team.is_fully_graded ?? (team.judges_counted >= totalJudges);
                const scoreDisplay = team.average_score !== undefined 
                  ? team.average_score 
                  : (team.total_score !== null && team.total_score !== undefined ? team.total_score : 0);

                return (
                  <tr key={team.team_number}>
                    <td className="rank-col">#{idx + 1}</td>
                    <td className="team-col">Team {team.team_number}</td>
                    <td className="score-col">
                      <span className="score-value">{scoreDisplay}</span>
                      {team.raw_score_sum !== undefined && team.judges_counted > 1 && (
                        <span 
                          className="score-raw-sum" 
                          title={`Sum of ${team.judges_counted} judge scores: ${team.raw_score_sum} pts`}
                        >
                          ({team.raw_score_sum} sum)
                        </span>
                      )}
                    </td>
                    <td className="status-col">
                      {isFullyGraded ? (
                        <span 
                          className="status-badge fully-graded" 
                          title="All assigned judges have submitted evaluations"
                        >
                          ✓ Fully Graded ({team.judges_counted}/{totalJudges})
                        </span>
                      ) : (
                        <span 
                          className="status-badge in-progress" 
                          title="Evaluation in progress: awaiting scores from remaining judges"
                        >
                          ⏳ In Progress ({team.judges_counted}/{totalJudges})
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="leaderboard-empty">No scores submitted yet.</p>
        )}
      </div>
    </section>
  );
};
