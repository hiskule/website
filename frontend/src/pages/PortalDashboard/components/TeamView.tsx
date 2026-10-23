import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { request } from '../../../shared/api/http';
import './TeamView.css';

interface ScoreResponse {
  id: number;
  judgeId: number;
  Judge: { name: string };
  scores: Record<string, number>;
  feedback: string;
}

interface Category {
  name: string;
  description: string;
  max_score: number;
}

export default function TeamView() {
  const { user } = useAuth();
  const [link, setLink] = useState(user?.presentation_link || '');
  const [comments, setComments] = useState(user?.team_comments || '');
  const [scores, setScores] = useState<ScoreResponse[]>([]);
  const [rubric, setRubric] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [feedbackReleased, setFeedbackReleased] = useState(false);
  
  // Track if we should show the form or the "already submitted" view
  const [isEditing, setIsEditing] = useState(!user?.presentation_link);

  useEffect(() => {
    fetchScores();
    fetchRubric();
  }, [user]);

  const fetchRubric = async () => {
    if (!user?.competitionId) return;
    try {
      const data = await request<any>(`/competitions/${user.competitionId}`);
      let cats = data?.categories;
      if (typeof cats === 'string') {
        try { cats = JSON.parse(cats); } catch { cats = []; }
      }
      setRubric(Array.isArray(cats) ? cats : []);
      setFeedbackReleased(!!data?.feedbackReleased);
    } catch (err) {
      console.error('Failed to fetch rubric:', err);
      setRubric([]);
    }
  };

  const fetchScores = async () => {
    if (!user?.id || !user?.competitionId) return;
    try {
      const data = await request<ScoreResponse[]>(`/teams/${user.id}/scores?competitionId=${user.competitionId}`);
      const parsedScores = (Array.isArray(data) ? data : []).map(score => {
        let sc = score.scores;
        if (typeof sc === 'string') {
          try { sc = JSON.parse(sc); } catch { sc = {}; }
        }
        return {
          ...score,
          scores: sc && typeof sc === 'object' ? sc : {}
        };
      });
      setScores(parsedScores);
    } catch (error) {
      console.error('Failed to fetch scores:', error);
      setScores([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.competitionId) return;

    setLoading(true);
    setMessage('');
    try {
      await request(`/teams/${user.id}/submission?competitionId=${user.competitionId}`, {
        method: 'POST',
        body: JSON.stringify({ link, comments })
      });

      setMessage('Submission successful!');
      setTimeout(() => {
        setIsEditing(false);
        setMessage('');
      }, 1500);
    } catch (error) {
      setMessage('Error submitting presentation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-view-container eng-grid-bg">
      <div className="team-content-wrapper">
        <header className="team-hero-header" style={{ marginBottom: '24px' }}>
          <h1 className="text-display-lg" style={{ margin: 0 }}>
            Welcome, {user?.team_number ? `Team ${user.team_number}` : (user?.name || 'Team')}
          </h1>
        </header>

      <div className="team-main-grid">
        <section className="team-submit-section">
          <div className="content-card team-submission-card">
            <div className="team-submission-content">
              <h2 className="text-headline-md" style={{ margin: '0 0 8px 0' }}>Submit Your Project</h2>
              <p className="team-subtitle" style={{ margin: '0 0 16px 0' }}>Upload your presentation link and any notes for the judges to review before the final presentation.</p>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="team-form">
                  <div className="form-group">
                    <label>Presentation Link (Google Slides, Canva, etc.)</label>
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Team Comments (Optional)</label>
                    <textarea 
                      placeholder="Any additional notes for the judges..." 
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="team-submit-btn" disabled={loading}>
                      {loading ? 'Submitting...' : 'SUBMIT PROJECT'}
                    </button>
                    {user?.presentation_link && (
                      <button type="button" className="team-cancel-btn" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    )}
                  </div>
                  
                  {message && <div className="team-message">{message}</div>}
                </form>
              ) : (
                <div className="team-submission-details">
                  <div className="submission-detail-row">
                    <label>Presentation:</label>
                    <a href={link} target="_blank" rel="noreferrer" className="submission-link">
                      View Project
                    </a>
                  </div>
                  {comments && (
                    <div className="submission-detail-row">
                      <label>Comments:</label>
                      <p className="submission-comment-text">"{comments}"</p>
                    </div>
                  )}
                  <div className="pt-stack-sm">
                    <button className="team-submit-btn" onClick={() => setIsEditing(true)}>
                      UPDATE SUBMISSION
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="team-feedback-section">
          <div className="team-feedback-header">
            <h2 className="text-headline-md">Judge Feedback</h2>
          </div>
          
          {(() => {
            const safeRubric = Array.isArray(rubric) ? rubric : [];
            if (!feedbackReleased) {
              if (safeRubric.length > 0) {
                return (
                  <div className="content-card" style={{ borderLeft: '4px solid var(--color-deep-navy)', borderRadius: 'var(--spacing-stack-sm)', overflow: 'hidden' }}>
                    <div className="feedback-card-header" style={{ display: 'block' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div className="feedback-judge-info">
                          <span className="text-headline-md judge-name">Evaluation Rubric</span>
                        </div>
                        <div className="feedback-total-score">
                          Max: {safeRubric.reduce((acc, c) => acc + (Number(c.max_score) || 0), 0)} pts
                        </div>
                      </div>
                      <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', margin: 0, fontSize: '14px' }}>
                        Your project will be evaluated based on the following criteria. Feedback will appear here once released by the admin.
                      </p>
                    </div>
                    <div className="feedback-card-body">
                      <div className="feedback-scores-breakdown" style={{ gap: '16px' }}>
                        {safeRubric.map((category, idx) => (
                          <div key={category.name} className="feedback-category-row" style={{ borderBottom: idx === safeRubric.length - 1 ? 'none' : '1px solid var(--color-outline-variant)', paddingBottom: idx === safeRubric.length - 1 ? '0' : '16px' }}>
                            <div className="feedback-category-text">
                              <span style={{ fontWeight: 600, color: 'var(--color-deep-navy)' }}>{category.name}</span>
                              <strong>{category.max_score} pts</strong>
                            </div>
                            <p className="text-body-md" style={{ margin: '8px 0 0 0', color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>
                              {category.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="content-card empty-feedback-card">
                    <p className="text-label-bold">Awaiting Judge Feedback</p>
                  </div>
                );
              }
            }

            if (scores.length === 0) {
              return (
                <div className="content-card empty-feedback-card">
                  <p className="text-label-bold">No judges have submitted scores for your team yet.</p>
                </div>
              );
            }

            return (
              <div className="team-feedback-list">
                {scores.map((score, index) => {
                  const scoreObj = (score.scores && typeof score.scores === 'object') ? score.scores : {};
                  const totalScore = Object.values(scoreObj).reduce((a, b) => Number(a) + Number(b), 0);
                  const maxScore = safeRubric.length > 0 ? safeRubric.reduce((acc, c) => acc + (Number(c.max_score) || 0), 0) : Object.keys(scoreObj).length * 10;
                  
                  return (
                    <div key={score.id} className="content-card feedback-card">
                      <div className="feedback-card-header">
                        <div className="feedback-judge-info">
                          <span className="text-headline-md judge-name">Judge {index + 1}</span>
                        </div>
                        <div className="feedback-total-score">
                          {totalScore}/{maxScore}
                        </div>
                      </div>
                      
                      <div className="feedback-card-body">
                        <div className="feedback-scores-breakdown">
                          {(safeRubric.length > 0 ? safeRubric.map(c => c.name) : Object.keys(scoreObj)).map(category => {
                            const val = scoreObj[category] !== undefined ? Number(scoreObj[category]) : 0;
                            const max = safeRubric.find(c => c.name === category)?.max_score || 10;
                            const percentage = Math.min(100, Math.max(0, (val / max) * 100));
                            
                            return (
                              <div key={category} className="feedback-category-row">
                                <div className="feedback-category-text">
                                  <span>{category}</span>
                                  <strong>{val} / {max}</strong>
                                </div>
                                <div className="feedback-progress-bg">
                                  <div className="feedback-progress-fill" style={{ width: `${percentage}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {score.feedback && (
                          <div className="feedback-comments-box">
                            <label>Constructive Feedback:</label>
                            <div className="feedback-comments-inner">
                              <p>"{score.feedback}"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </section>
      </div>
      </div>
    </div>
  );
}
