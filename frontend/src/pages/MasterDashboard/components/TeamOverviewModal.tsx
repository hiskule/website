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

interface Category {
  name: string;
  description?: string;
  max_score?: number;
}

export const TeamOverviewModal: React.FC<TeamOverviewModalProps> = ({ team, competitionId, onClose, onUpdate }) => {
  const [teamScores, setTeamScores] = useState<any[]>([]);
  const [rubricCategories, setRubricCategories] = useState<Category[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const [editStates, setEditStates] = useState<Record<number, { scores: Record<string, number>; feedback: string }>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [statusMessages, setStatusMessages] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoadingScores(true);
      try {
        if (competitionId) {
          try {
            const compData = await request<any>(`/competitions/${competitionId}`);
            let cats = compData?.categories;
            if (typeof cats === 'string') {
              try { cats = JSON.parse(cats); } catch { cats = []; }
            }
            if (Array.isArray(cats)) {
              setRubricCategories(cats);
            }
          } catch (e) {
            console.error('Error fetching competition categories:', e);
          }
        }

        const data = await request<any[]>(`/teams/${team.id}/scores?competitionId=${competitionId}`);
        const parsedData = data.map((d: any) => {
          let parsed = d.scores;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch { parsed = {}; }
          }
          return { ...d, scores: parsed || {} };
        });
        setTeamScores(parsedData);

        const initialEdits: Record<number, { scores: Record<string, number>; feedback: string }> = {};
        parsedData.forEach(d => {
          initialEdits[d.id] = {
            scores: { ...(d.scores || {}) },
            feedback: d.feedback || ''
          };
        });
        setEditStates(initialEdits);
      } catch (err) {
        console.error('Error loading team scores:', err);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchData();
  }, [team.id, competitionId]);

  const handleScoreChange = (scoreId: number, category: string, value: number) => {
    setEditStates(prev => ({
      ...prev,
      [scoreId]: {
        ...prev[scoreId],
        scores: {
          ...(prev[scoreId]?.scores || {}),
          [category]: value
        }
      }
    }));
  };

  const handleFeedbackChange = (scoreId: number, feedback: string) => {
    setEditStates(prev => ({
      ...prev,
      [scoreId]: {
        ...prev[scoreId],
        feedback
      }
    }));
  };

  const handleSaveOverride = async (scoreRecord: any) => {
    if (!competitionId) return;
    const current = editStates[scoreRecord.id];
    if (!current) return;

    setSavingId(scoreRecord.id);
    setStatusMessages(prev => ({ ...prev, [scoreRecord.id]: '' }));

    try {
      await request('/judge', {
        method: 'POST',
        body: JSON.stringify({
          competitionId,
          judgeId: scoreRecord.judgeId,
          teamId: team.id,
          scores: current.scores,
          feedback: current.feedback
        })
      });

      setStatusMessages(prev => ({ ...prev, [scoreRecord.id]: 'Score successfully updated in database.' }));
      onUpdate();
      setTimeout(() => {
        setStatusMessages(prev => ({ ...prev, [scoreRecord.id]: '' }));
      }, 3500);
    } catch (err: any) {
      console.error('Failed to override score:', err);
      setStatusMessages(prev => ({ ...prev, [scoreRecord.id]: `Error: ${err.message || 'Failed to save override'}` }));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="judge-modal-overlay" onClick={onClose}>
      <div className="judge-modal-content team-overview-modal-content" onClick={e => e.stopPropagation()}>
        <div className="judge-modal-header">
          <div>
            <h3>Team {team.team_number} Evaluations</h3>
            <p className="team-modal-subtitle">Review and override judge evaluations as admin.</p>
          </div>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="team-modal-body">
          {loadingScores ? (
            <p className="team-modal-loading">Loading evaluations...</p>
          ) : teamScores.length > 0 ? (
            <div className="team-modal-scores-list">
              {teamScores.map(score => {
                const currentEdit = editStates[score.id] || { scores: score.scores, feedback: score.feedback || '' };
                const currentScores = currentEdit.scores || {};

                const categoryList: Category[] = rubricCategories.length > 0
                  ? rubricCategories
                  : Object.keys(currentScores).map(k => ({ name: k, max_score: 10 }));

                const totalCurrentScore = Object.values(currentScores).reduce((acc: number, v: any) => acc + (Number(v) || 0), 0);

                return (
                  <div key={score.id} className="team-modal-score-card">
                    <div className="team-modal-card-header">
                      <h4 className="team-modal-judge-name">
                        Judge: <strong>{score.Judge?.name || `Judge ${score.judgeId}`}</strong>
                      </h4>
                      <span className="team-modal-total-badge">
                        Total: {totalCurrentScore} pts
                      </span>
                    </div>

                    <div className="team-modal-rubrics-container">
                      <span className="team-modal-field-heading">Rubric Category Scores (Override)</span>
                      <div className="team-modal-category-grid">
                        {categoryList.map(cat => {
                          const catName = typeof cat === 'string' ? cat : cat.name;
                          const maxVal = (typeof cat === 'object' && cat.max_score) ? cat.max_score : 10;
                          const val = currentScores[catName] !== undefined ? currentScores[catName] : 0;

                          return (
                            <div key={catName} className="team-modal-cat-row">
                              <div className="team-modal-cat-meta">
                                <label className="team-modal-cat-label">{catName}</label>
                                <span className="team-modal-cat-indicator">{val} / {maxVal}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={maxVal}
                                value={val}
                                onChange={e => handleScoreChange(score.id, catName, parseInt(e.target.value) || 0)}
                                className="team-modal-score-slider"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="team-modal-feedback-edit-box">
                      <label className="team-modal-field-heading">Judge Feedback (Override)</label>
                      <textarea
                        className="team-modal-feedback-textarea"
                        rows={3}
                        value={currentEdit.feedback}
                        onChange={e => handleFeedbackChange(score.id, e.target.value)}
                        placeholder="Provide or edit constructive feedback..."
                      />
                    </div>

                    <div className="team-modal-card-actions">
                      {statusMessages[score.id] && (
                        <span className={`team-modal-status-text ${statusMessages[score.id].startsWith('Error') ? 'error' : 'success'}`}>
                          {statusMessages[score.id]}
                        </span>
                      )}
                      <button
                        type="button"
                        className="team-modal-override-save-btn"
                        onClick={() => handleSaveOverride(score)}
                        disabled={savingId === score.id}
                      >
                        {savingId === score.id ? 'SAVING...' : 'SAVE OVERRIDE'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-label-sm team-modal-empty-text">No judges have evaluated this team yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
