import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './JudgeView.css';

interface TeamSchedule {
  id: number;
  team_number: number;
  start_time: string;
  end_time: string;
  presentation_link: string | null;
  team_comments: string | null;
}

interface Category {
  name: string;
  description: string;
  max_score: number;
}

interface Competition {
  id: number;
  categories: Category[];
}

export default function JudgeView() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<TeamSchedule[]>([]);
  const [roomName, setRoomName] = useState('');
  const [rubric, setRubric] = useState<Category[]>([]);
  
  const [activeTeam, setActiveTeam] = useState<TeamSchedule | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchSchedule();
    fetchRubric();
  }, [user]);

  const fetchSchedule = async () => {
    if (!user?.id || !user?.competitionId) return;
    try {
      const res = await fetch(`${API_URL}/judges/${user.id}/schedule?competitionId=${user.competitionId}`);
      if (res.ok) {
        const data = await res.json();
        setSchedule(data.schedule || []);
        setRoomName(data.room || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRubric = async () => {
    if (!user?.competitionId) return;
    try {
      const res = await fetch(`${API_URL}/competitions/${user.competitionId}`);
      if (res.ok) {
        const data: Competition = await res.json();
        setRubric(data.categories || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openScoring = async (team: TeamSchedule) => {
    setActiveTeam(team);
    setMessage('');
    setFeedback('');
    
    // Initialize scores to 0
    const initialScores: Record<string, number> = {};
    rubric.forEach(cat => initialScores[cat.name] = 0);
    setScores(initialScores);

    // Fetch previous scores if any
    try {
      const res = await fetch(`${API_URL}/scores/${user?.id}/${team.id}?competitionId=${user?.competitionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.previousScores) {
          setScores(data.previousScores.scores || initialScores);
          setFeedback(data.previousScores.feedback || '');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScoreChange = (categoryName: string, value: number) => {
    setScores(prev => ({ ...prev, [categoryName]: value }));
  };

  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam || !user?.id || !user?.competitionId) return;

    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/judge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitionId: user.competitionId,
          judgeId: user.id,
          teamId: activeTeam.id,
          scores,
          feedback
        })
      });

      if (!res.ok) throw new Error('Failed to submit scores');
      setMessage('✅ Scores saved successfully!');
      
      // Close modal after delay
      setTimeout(() => {
        setActiveTeam(null);
        setMessage('');
      }, 1500);
      
    } catch (err) {
      setMessage('❌ Failed to save scores');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="judge-view-container">
      <div className="judge-header">
        <div className="judge-header-info">
          <h3>Your Schedule</h3>
          <span className="room-badge">{roomName ? `Room: ${roomName}` : 'No Room Assigned'}</span>
        </div>
        <p className="judge-subtitle">Select a team below to view materials and submit your evaluation.</p>
      </div>

      <div className="team-schedule-grid">
        {schedule.length === 0 ? (
          <div className="empty-schedule">No teams assigned to this room yet.</div>
        ) : (
          schedule.map((team) => (
            <div key={team.id} className="schedule-card" onClick={() => openScoring(team)}>
              <div className="schedule-time">
                {team.start_time} - {team.end_time}
              </div>
              <div className="schedule-team-name">
                Team {team.team_number}
              </div>
              <div className="schedule-actions">
                <button className="grade-btn">Evaluate</button>
              </div>
            </div>
          ))
        )}
      </div>

      {activeTeam && (
        <div className="scoring-modal-overlay" onClick={() => setActiveTeam(null)}>
          <div className="scoring-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Evaluating Team {activeTeam.team_number}</h2>
              <button className="close-btn" onClick={() => setActiveTeam(null)}>×</button>
            </div>

            <div className="team-materials">
              {activeTeam.presentation_link ? (
                <a href={activeTeam.presentation_link} target="_blank" rel="noreferrer" className="material-link">
                  View Presentation
                </a>
              ) : (
                <span className="no-material">No presentation linked yet.</span>
              )}
              {activeTeam.team_comments && (
                <div className="team-notes">
                  <strong>Team Notes:</strong> {activeTeam.team_comments}
                </div>
              )}
            </div>

            <form onSubmit={submitScore} className="scoring-form">
              <div className="rubric-section">
                {rubric.map(cat => (
                  <div key={cat.name} className="rubric-item">
                    <div className="rubric-item-header">
                      <label>{cat.name}</label>
                      <span className="score-display">{scores[cat.name] || 0} / {cat.max_score}</span>
                    </div>
                    <p className="rubric-desc">{cat.description}</p>
                    <input 
                      type="range" 
                      min="0" 
                      max={cat.max_score} 
                      value={scores[cat.name] || 0}
                      onChange={(e) => handleScoreChange(cat.name, parseInt(e.target.value))}
                      className="score-slider"
                    />
                  </div>
                ))}
              </div>

              <div className="feedback-section">
                <label>Constructive Feedback</label>
                <textarea 
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback for the team..."
                  rows={4}
                />
              </div>

              <div className="modal-footer">
                {message && <span className="modal-message">{message}</span>}
                <button type="submit" className="submit-score-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
