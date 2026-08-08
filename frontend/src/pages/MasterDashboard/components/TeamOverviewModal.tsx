import React, { useState, useEffect } from 'react';
import './RoomCard.css';
import './TeamOverviewModal.css';
import { request } from '../../../shared/api/http';

interface Team {
  id: number;
  team_number: number;
  start_time: string;
  end_time: string;
  presentation_link: string | null;
  isGraded: boolean;
}

interface TeamOverviewModalProps {
  team: Team;
  competitionId?: number;
  onClose: () => void;
  onUpdate: () => void;
}

export const TeamOverviewModal: React.FC<TeamOverviewModalProps> = ({ team, competitionId, onClose, onUpdate }) => {
  const [teamScores, setTeamScores] = useState<any[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      setLoadingScores(true);
      try {
        const data = await request<any[]>(`/teams/${team.id}/scores?competitionId=${competitionId}`);
        const parsedData = data.map((d: any) => {
          let parsed = d.scores;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch(e) { parsed = {}; }
          }
          return { ...d, scores: parsed };
        });
        setTeamScores(parsedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchScores();
  }, [team.id, competitionId]);

  const handleForceUpload = async () => {
    const link = window.prompt("Enter the presentation link (Google Drive/Slides) for this team:");
    if (!link) return;

    try {
      await request(`/teams/${team.id}/submission?competitionId=${competitionId}`, {
        method: 'POST',
        body: JSON.stringify({ link, comments: "Admin force upload" })
      });
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message || "Failed to force upload presentation"}`);
    }
  };

  return (
    <div className="judge-modal-overlay" onClick={onClose}>
      <div className="judge-modal-content" onClick={e => e.stopPropagation()}>
        <div className="judge-modal-header">
          <h3>Team {team.team_number} Details</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="team-modal-section">
          <div className="team-modal-section-header">
            <h4 className="team-modal-section-title">Presentation File</h4>
            <button 
              onClick={handleForceUpload}
              className="team-modal-edit-btn"
            >
              {team.presentation_link ? 'Edit Submission' : 'Force Upload'}
            </button>
          </div>
          
          {team.presentation_link ? (
            <a href={team.presentation_link} target="_blank" rel="noopener noreferrer" className="team-modal-link">
              View Submission
            </a>
          ) : (
            <p className="text-label-sm team-modal-empty-text">No file submitted yet.</p>
          )}
        </div>

        <div>
          <h4 className="team-modal-rubrics-title">Grading Rubrics</h4>
          {loadingScores ? (
            <p>Loading scores...</p>
          ) : teamScores.length > 0 ? (
            <div className="team-modal-scores-list">
              {teamScores.map(score => (
                <div key={score.id} className="team-modal-score-card">
                  <h5 className="team-modal-judge-name">Judge: {score.Judge?.name}</h5>
                  
                  <div className="team-modal-score-grid">
                    {Object.entries(score.scores).map(([category, value]) => (
                      <div key={category} className="team-modal-score-item">
                        <span className="team-modal-score-category">{category}</span>
                        <span className="team-modal-score-value">{value as number}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="team-modal-feedback-box">
                    <span className="team-modal-feedback-label">Feedback:</span>
                    <p className="team-modal-feedback-text">
                      {score.feedback || 'No feedback provided.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-label-sm team-modal-empty-text">No judges have graded this team yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
