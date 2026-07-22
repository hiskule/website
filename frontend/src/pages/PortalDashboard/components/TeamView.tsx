import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
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
  
  // Track if we should show the form or the "already submitted" view
  const [isEditing, setIsEditing] = useState(!user?.presentation_link);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchScores();
    fetchRubric();
  }, [user]);

  const fetchRubric = async () => {
    if (!user?.competitionId) return;
    try {
      const res = await fetch(`${API_URL}/competitions/${user.competitionId}`);
      if (res.ok) {
        const data = await res.json();
        setRubric(data.categories || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchScores = async () => {
    if (!user?.id || !user?.competitionId) return;
    try {
      const response = await fetch(`${API_URL}/teams/${user.id}/scores?competitionId=${user.competitionId}`);
      if (response.ok) {
        const data = await response.json();
        setScores(data);
      }
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.competitionId) return;

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/teams/${user.id}/submission?competitionId=${user.competitionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link, comments })
      });

      if (!response.ok) throw new Error('Submission failed');
      setMessage('✅ Submission successful!');
      setTimeout(() => {
        setIsEditing(false);
        setMessage('');
      }, 1500);
    } catch (error) {
      setMessage('❌ Error submitting presentation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-view-container">
      <div className="team-submission-card">
        <h3>Submit Your Project</h3>
        <p className="team-subtitle">Upload your presentation link and any notes for the judges.</p>
        
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
                {loading ? 'Submitting...' : 'Submit Project'}
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
            <div className="submission-row">
              <strong>Presentation:</strong>
              <a href={link} target="_blank" rel="noreferrer" className="submission-link">View Project</a>
            </div>
            {comments && (
              <div className="submission-row">
                <strong>Comments:</strong>
                <p>{comments}</p>
              </div>
            )}
            <button className="team-submit-btn update-btn" onClick={() => setIsEditing(true)}>
              Update Submission
            </button>
          </div>
        )}
      </div>

      <div className="team-feedback-section">
        <h3>Judge Feedback</h3>
        {scores.length === 0 ? (
          <div className="team-no-feedback">
            <p>No feedback received yet. Good luck with your presentation!</p>
          </div>
        ) : (
          <div className="team-feedback-grid">
            {scores.map((score, index) => {
              const totalScore = Object.values(score.scores).reduce((a, b) => a + b, 0);
              
              return (
                <div key={score.id} className="team-feedback-card">
                  <div className="feedback-header">
                    <h4>Judge {index + 1}</h4>
                    <div className="total-score-badge">{totalScore} pts</div>
                  </div>
                  
                  <div className="feedback-scores-breakdown">
                    {/* Map over the official rubric to guarantee correct ordering */}
                    {(rubric.length > 0 ? rubric.map(c => c.name) : Object.keys(score.scores)).map(category => (
                      <div key={category} className="feedback-category">
                        <span className="category-name">{category}</span>
                        <span className="category-value">{score.scores[category] !== undefined ? score.scores[category] : '-'}</span>
                      </div>
                    ))}
                  </div>

                  {score.feedback && (
                    <div className="feedback-text">
                      <p>"{score.feedback}"</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
