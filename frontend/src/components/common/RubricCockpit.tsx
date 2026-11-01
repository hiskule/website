import React from 'react';
import './RubricCockpit.css';

export interface RubricCriterion {
  id: string;
  name: string;
  max_score: number;
  levels?: Record<string, string>;
}

export interface RubricSection {
  id: string;
  name: string;
  max_score: number;
  criteria: RubricCriterion[];
}

export interface FlatCategory {
  name: string;
  description?: string;
  max_score: number;
}

export interface JudgingPenalty {
  id: string;
  name: string;
  deduction: number;
}

export interface RubricCockpitProps {
  sections: RubricSection[];
  flatCategories?: FlatCategory[];
  penalties?: JudgingPenalty[];
  totalMaxScore: number;
  criteriaScores: Record<string, number>;
  inputStrings: Record<string, string>;
  selectedPenalties: string[];
  feedbackStrengths: string;
  feedbackImprovements: string;
  feedbackComments: string;
  onPillSelect: (id: string, point: number) => void;
  onInputChange: (id: string, maxScore: number, rawVal: string) => void;
  onInputBlur: (id: string, maxScore: number) => void;
  onTogglePenalty: (penaltyId: string) => void;
  onFeedbackChange: (field: 'strengths' | 'improvements' | 'comments', val: string) => void;
  onSubmit: (e?: React.FormEvent) => void | Promise<void>;
  submitting: boolean;
  submitButtonText?: string;
  statusMessage?: string;
  rubricDocUrl?: string;
  onClose?: () => void;
}

const DEFAULT_RUBRIC_DOC_URL = 'https://www.google.com/search?q=cool+dog&oq=cool+dog&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIKCAgQABiABBi0BzIHCAkQABiABNIBCDMxOThqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8';

export const RubricCockpit: React.FC<RubricCockpitProps> = ({
  sections,
  flatCategories = [],
  penalties = [],
  totalMaxScore,
  criteriaScores,
  inputStrings,
  selectedPenalties,
  feedbackStrengths,
  feedbackImprovements,
  feedbackComments,
  onPillSelect,
  onInputChange,
  onInputBlur,
  onTogglePenalty,
  onFeedbackChange,
  onSubmit,
  submitting,
  submitButtonText = 'SAVE EVALUATION',
  statusMessage,
  rubricDocUrl = DEFAULT_RUBRIC_DOC_URL,
  onClose
}) => {
  const onSubmitRef = React.useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  const submittingRef = React.useRef(submitting);
  submittingRef.current = submitting;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (e.key === 'Enter') {
        // Multi-line feedback fields require normal Enter for line breaks.
        // Allow Ctrl+Enter or Cmd+Enter to submit from within textarea.
        if (e.target instanceof HTMLTextAreaElement && !e.ctrlKey && !e.metaKey) {
          return;
        }

        if (submittingRef.current) {
          return;
        }

        // Flush active input validation/clamping by triggering blur
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        e.preventDefault();
        onSubmitRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isStructured = sections.length > 0;

  // Score calculations
  const rawScore = Object.values(criteriaScores).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const penaltyDeduction = (selectedPenalties || []).reduce((sum, pId) => {
    const p = penalties.find(pen => pen.id === pId);
    return sum + (p ? p.deduction : 0);
  }, 0);
  const finalScore = Math.max(0, rawScore - penaltyDeduction);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="cockpit-form" style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'column', overflow: 'hidden' }}>
      <div className="cockpit-header-strip">
        <div className="rubric-doc-notice">
          <svg className="doc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span className="doc-notice-text">Looking for full criteria definitions and level descriptors?</span>
        </div>
        <a
          href={rubricDocUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rubric-doc-button"
        >
          <span>Detailed Rubric Document</span>
          <svg className="doc-ext-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>

      <div className="cockpit-grid">
        {/* PANE 1: Rubric Criteria Pane */}
        <div className="cockpit-col col-rubric">
          <div className="rubric-sections-container">
            {isStructured ? (
              sections.map(sec => (
                <div key={sec.id} className="cockpit-section-card">
                  <div className="cockpit-section-header">
                    <h4>{sec.name}</h4>
                    <span className="section-pts-badge">Max {sec.max_score} pts</span>
                  </div>
                  <div className="cockpit-criteria-list">
                    {sec.criteria.map(crit => {
                      const currentVal = criteriaScores[crit.id] ?? 0;
                      const currentInput = inputStrings[crit.id] ?? String(currentVal);
                      const pointOptions = Array.from({ length: crit.max_score + 1 }, (_, i) => i);

                      return (
                        <div key={crit.id} className="cockpit-crit-row">
                          <div className="crit-meta">
                            <span className="crit-id-badge">{crit.id}</span>
                            <span className="crit-name" title={crit.name}>{crit.name}</span>
                          </div>
                          <div className="crit-controls">
                            <div className="crit-pill-group">
                              {pointOptions.map(pt => (
                                <button
                                  key={pt}
                                  type="button"
                                  className={`crit-pill-btn ${currentVal === pt ? 'selected' : ''}`}
                                  onClick={() => onPillSelect(crit.id, pt)}
                                  title={crit.levels ? (crit.levels[pt] || `${pt} Points`) : `${pt} Points`}
                                >
                                  {pt}
                                </button>
                              ))}
                            </div>
                            <div className="crit-input-box">
                              <input
                                type="text"
                                className="crit-score-input"
                                value={currentInput}
                                onChange={e => onInputChange(crit.id, crit.max_score, e.target.value)}
                                onBlur={() => onInputBlur(crit.id, crit.max_score)}
                              />
                              <span className="crit-max-label">/{crit.max_score}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              /* CASE B: Flat Categories (e.g. Designapalooza) */
              <div className="cockpit-section-card">
              <div className="cockpit-section-header">
                <h4>Competition Categories</h4>
                <span className="section-pts-badge">Total {totalMaxScore} pts</span>
              </div>
              <div className="cockpit-criteria-list">
                {flatCategories.map(cat => {
                  const currentVal = criteriaScores[cat.name] ?? 0;
                  const currentInput = inputStrings[cat.name] ?? String(currentVal);
                  const maxScore = cat.max_score || 10;
                  const pointOptions = Array.from({ length: maxScore + 1 }, (_, i) => i);

                  return (
                    <div key={cat.name} className="cockpit-crit-row" style={{ padding: '6px 0' }}>
                      <div className="crit-meta">
                        <span className="crit-name" style={{ fontSize: '0.9rem' }}>{cat.name}</span>
                        {cat.description && <span style={{ fontSize: '0.75rem', color: '#64748B' }}>({cat.description})</span>}
                      </div>
                      <div className="crit-controls">
                        <div className="crit-pill-group">
                          {pointOptions.map(pt => (
                            <button
                              key={pt}
                              type="button"
                              className={`crit-pill-btn ${currentVal === pt ? 'selected' : ''}`}
                              onClick={() => onPillSelect(cat.name, pt)}
                              title={`${cat.name}: ${pt} / ${maxScore}`}
                            >
                              {pt}
                            </button>
                          ))}
                        </div>
                        <div className="crit-input-box">
                          <input
                            type="text"
                            className="crit-score-input"
                            value={currentInput}
                            onChange={e => onInputChange(cat.name, maxScore, e.target.value)}
                            onBlur={() => onInputBlur(cat.name, maxScore)}
                          />
                          <span className="crit-max-label">/{maxScore}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

        {/* COLUMN 3: Score Summary, Penalties, Feedback & Submit */}
        <div className="cockpit-col col-sidebar">
          <div className="col-sidebar-scroll">
            {/* Score Breakdown Card */}
            <div className="summary-score-card">
              <div className="summary-score-row">
                <span>Rubric Score:</span>
                <strong>{rawScore} / {totalMaxScore}</strong>
              </div>
              {penalties.length > 0 && (
                <div className="summary-score-row penalty-row">
                  <span>Penalties:</span>
                  <strong className={penaltyDeduction > 0 ? "penalty-text" : ""}>
                    {penaltyDeduction > 0 ? `-${penaltyDeduction} pts` : '0 pts'}
                  </strong>
                </div>
              )}
              <div className="summary-score-row final-row">
                <span>Final Score:</span>
                <strong className="final-text">{finalScore} / {totalMaxScore}</strong>
              </div>
            </div>

            {/* Penalties Checklist (Only shown if competition has penalties defined) */}
            {penalties.length > 0 && (
              <div className="penalties-card">
                <div className="penalties-card-header">
                  <h5>Judging Penalties</h5>
                  <span className="penalties-subtext">Click if enforced</span>
                </div>
                <div className="penalties-list">
                  {penalties.map(pen => {
                    const isChecked = selectedPenalties.includes(pen.id);
                    return (
                      <label key={pen.id} className={`penalty-item ${isChecked ? 'active' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onTogglePenalty(pen.id)}
                          className="penalty-checkbox"
                        />
                        <span className="penalty-name">{pen.name}</span>
                        <span className="penalty-badge">-{pen.deduction}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback Card */}
            <div className="feedback-card">
              <div className="feedback-card-header">
                <h5>Judge Feedback</h5>
                <span className="feedback-card-subtext">Constructive comments for the team</span>
              </div>
              {isStructured ? (
                <>
                  <div className="feedback-field">
                    <label>Key Strengths & Highlights</label>
                    <textarea
                      value={feedbackStrengths}
                      onChange={e => onFeedbackChange('strengths', e.target.value)}
                      placeholder="What did the team do exceptionally well? (e.g. clear prototype demo, strong research)"
                      rows={3}
                    />
                  </div>
                  <div className="feedback-field">
                    <label>Areas for Improvement</label>
                    <textarea
                      value={feedbackImprovements}
                      onChange={e => onFeedbackChange('improvements', e.target.value)}
                      placeholder="Constructive feedback, missed requirements, or design suggestions"
                      rows={3}
                    />
                  </div>
                  <div className="feedback-field">
                    <label>Additional Comments</label>
                    <textarea
                      value={feedbackComments}
                      onChange={e => onFeedbackChange('comments', e.target.value)}
                      placeholder="General remarks, presentation delivery, or notes"
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <div className="feedback-field" style={{ flex: 1 }}>
                  <label>Comments & Notes</label>
                  <textarea
                    value={feedbackComments || feedbackStrengths}
                    onChange={e => onFeedbackChange('comments', e.target.value)}
                    placeholder="Provide constructive feedback for the team..."
                    rows={8}
                    style={{ minHeight: '140px' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="cockpit-footer">
            {statusMessage && (
              <div className={`cockpit-status-msg ${statusMessage.toLowerCase().includes('error') ? 'error' : 'success'}`}>
                {statusMessage}
              </div>
            )}
            <button type="submit" className="cockpit-submit-btn" disabled={submitting}>
              {submitting ? 'SAVING...' : submitButtonText}
            </button>
            <div className="cockpit-shortcuts-hint">
              <span><strong>Enter ↵</strong> Save</span>
              <span>•</span>
              <span><strong>Esc</strong> Close</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
