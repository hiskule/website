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
  isGraded?: boolean;
  Scores?: any[];
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
    
    // Initialize scores to 0 or existing
    const initialScores: Record<string, number> = {};
    const existingScore = (team.Scores && team.Scores.length > 0) ? team.Scores[0] : null;

    rubric.forEach(cat => {
      initialScores[cat.name] = (existingScore && existingScore.scores) 
        ? (existingScore.scores[cat.name] || 0) 
        : 0;
    });
    setScores(initialScores);
    setFeedback(existingScore ? existingScore.feedback || '' : '');
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
      setMessage('Scores saved successfully!');
      
      // Refresh schedule to update badges
      fetchSchedule();

      // Close modal after delay
      setTimeout(() => {
        setActiveTeam(null);
        setMessage('');
      }, 1500);
      
    } catch (err) {
      setMessage('Failed to save scores');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="judge-view-container">
      <div className="judge-hero-header">
        <div className="judge-hero-bg-pattern"></div>
        <div className="judge-hero-content">
          <header className="judge-header-flex">
            <h1 className="text-display-lg judge-portal-title">Portal Dashboard</h1>
            <div className="judge-welcome-row">
              <p className="text-body-lg judge-welcome-text">
                Welcome, <strong>{user?.name || user?.username}</strong>
              </p>
              <span className="judge-role-badge">JUDGE</span>
            </div>
          </header>
        </div>
      </div>

      <main className="judge-main-content">
        <section className="judge-schedule-section">
          <div className="judge-schedule-header" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div className="judge-schedule-title-row" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-stack-md)' }}>
              <h2 className="text-headline-lg" style={{ margin: 0 }}>Your Schedule</h2>
              <div className="judge-room-badge">
                <span className="text-label-bold">Room: {roomName || 'Unassigned'}</span>
              </div>
            </div>
            <p className="judge-schedule-subtitle" style={{ maxWidth: '420px', textAlign: 'right', margin: 0, color: 'var(--color-on-surface-variant)', fontSize: '15px' }}>
              Select a team below to view submitted technical materials, presentation deck, and submit your final evaluation.
            </p>
          </div>

          <div className="team-schedule-grid">
            {schedule.length === 0 ? (
              <div className="empty-schedule text-label-bold">No teams assigned to this room yet.</div>
            ) : (
              schedule.map((team) => (
                <div key={team.id} className="bento-card schedule-card" onClick={() => openScoring(team)}>
                  <div className="schedule-card-top">
                    <div className="schedule-time-badge">
                      {team.start_time} - {team.end_time}
                    </div>
                  </div>
                  <div className="schedule-card-mid">
                    <h3 className="text-headline-md team-name-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Team {team.team_number}
                      {team.presentation_link ? (
                        <span className="status-badge submitted">File Submitted</span>
                      ) : (
                        <span className="status-badge missing">No File Submitted</span>
                      )}
                    </h3>
                    <div style={{ marginTop: '4px' }}>
                      {team.isGraded ? (
                        <span className="status-badge evaluated">Evaluated</span>
                      ) : (
                        <span className="status-badge pending">Pending Evaluation</span>
                      )}
                    </div>
                  </div>
                  <button className="grade-btn">
                    {team.isGraded ? 'Edit Evaluation' : 'Evaluate'}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {activeTeam && (
        <div className="scoring-modal-overlay" onClick={() => setActiveTeam(null)}>
          <div className="scoring-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Evaluating Team {activeTeam.team_number}</h2>
              <button className="close-btn" onClick={() => setActiveTeam(null)}>×</button>
            </div>

            <div className="team-materials">
              <h3 className="section-subtitle">Team Submission</h3>
              {activeTeam.presentation_link ? (
                <a href={activeTeam.presentation_link} target="_blank" rel="noreferrer" className="material-link">
                  View Presentation
                </a>
              ) : (
                <div className="no-material" style={{ marginBottom: '1rem' }}>No presentation linked yet.</div>
              )}
              {activeTeam.team_comments && (
                <div className="team-notes">
                  <strong>Team Notes:</strong> {activeTeam.team_comments}
                </div>
              )}
            </div>

            <form onSubmit={submitScore} className="scoring-form">
              <div className="rubric-section">
                <h3 className="section-subtitle">Evaluation Rubric</h3>
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
