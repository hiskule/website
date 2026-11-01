import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { request } from '../../../shared/api/http';
import { RubricCockpit } from '../../../components/common/RubricCockpit';
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

interface RubricCriterion {
  id: string;
  name: string;
  max_score: number;
  levels?: Record<number, string>;
}

interface RubricSection {
  id: string;
  name: string;
  max_score: number;
  criteria: RubricCriterion[];
}

interface JudgingPenalty {
  id: string;
  name: string;
  deduction: number;
}

interface FlatCategory {
  name: string;
  description?: string;
  max_score: number;
}

function parseFeedback(rawFeedback: string | null | undefined) {
  if (!rawFeedback) return { strengths: '', improvements: '', comments: '' };
  const strengthsMatch = rawFeedback.match(/(?:###\s*Strengths|Strengths:?)\s*([\s\S]*?)(?=(?:###\s*Areas for Improvement|Areas for Improvement:?|###\s*Additional Comments|Additional Comments:?|$))/i);
  const improvementsMatch = rawFeedback.match(/(?:###\s*Areas for Improvement|Areas for Improvement:?)\s*([\s\S]*?)(?=(?:###\s*Additional Comments|Additional Comments:?|$))/i);
  const commentsMatch = rawFeedback.match(/(?:###\s*Additional Comments|Additional Comments:?)\s*([\s\S]*?)$/i);

  if (strengthsMatch || improvementsMatch || commentsMatch) {
    return {
      strengths: strengthsMatch ? strengthsMatch[1].trim() : '',
      improvements: improvementsMatch ? improvementsMatch[1].trim() : '',
      comments: commentsMatch ? commentsMatch[1].trim() : ''
    };
  }
  return { strengths: '', improvements: '', comments: rawFeedback.trim() };
}

function formatFeedback(strengths: string, improvements: string, comments: string) {
  const parts: string[] = [];
  if (strengths.trim()) parts.push(`### Strengths\n${strengths.trim()}`);
  if (improvements.trim()) parts.push(`### Areas for Improvement\n${improvements.trim()}`);
  if (comments.trim()) parts.push(`### Additional Comments\n${comments.trim()}`);
  return parts.join('\n\n');
}

export default function JudgeView() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<TeamSchedule[]>([]);
  const [roomName, setRoomName] = useState('');
  
  // Dynamic rubric from DB
  const [sections, setSections] = useState<RubricSection[]>([]);
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);
  const [penalties, setPenalties] = useState<JudgingPenalty[]>([]);
  const [totalMaxScore, setTotalMaxScore] = useState<number>(25);

  const [activeTeam, setActiveTeam] = useState<TeamSchedule | null>(null);
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>({});
  const [inputStrings, setInputStrings] = useState<Record<string, string>>({});
  const [selectedPenalties, setSelectedPenalties] = useState<string[]>([]);
  const [feedbackStrengths, setFeedbackStrengths] = useState('');
  const [feedbackImprovements, setFeedbackImprovements] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [rubricDocUrl, setRubricDocUrl] = useState<string>(
    'https://www.google.com/search?q=cool+dog&oq=cool+dog&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIKCAgQABiABBi0BzIHCAkQABiABNIBCDMxOThqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8'
  );

  useEffect(() => {
    fetchSchedule();
    fetchRubric();
  }, [user]);

  // Background sync for real-time schedule updates (paused while grading in rubric modal)
  useEffect(() => {
    if (!user?.id || !user?.competitionId) return;

    const interval = setInterval(() => {
      if (!activeTeam) {
        fetchSchedule();
      }
    }, 15000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !activeTeam) {
        fetchSchedule();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, activeTeam]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTeam) {
        setActiveTeam(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTeam]);

  const fetchSchedule = async () => {
    const judgeId = user?.id;
    const compId = user?.competitionId || (user as any)?.Competition?.id;
    if (!judgeId) return;
    try {
      const queryParam = compId ? `?competitionId=${compId}` : '';
      const data = await request<any>(`/judges/${judgeId}/schedule${queryParam}`);
      setSchedule(data.schedule || []);
      setRoomName(data.room || '');
    } catch (err) {
      console.error('Failed to fetch schedule:', err);
    }
  };

  const fetchRubric = async () => {
    const compId = user?.competitionId || (user as any)?.Competition?.id;
    try {
      let data: any = null;
      if (compId) {
        data = await request<any>(`/competitions/${compId}`);
      } else {
        const comps = await request<any[]>('/competitions');
        data = (comps || []).find((c: any) => c.isActive) || comps?.[0];
      }
      let cats = data?.categories;
      if (typeof cats === 'string') {
        try { cats = JSON.parse(cats); } catch { cats = null; }
      }
      if (cats && typeof cats === 'object' && !Array.isArray(cats)) {
        if (cats.document_url || cats.rubric_url) {
          setRubricDocUrl(cats.document_url || cats.rubric_url);
        }
      }
      if (cats && typeof cats === 'object' && !Array.isArray(cats) && Array.isArray(cats.sections)) {
        // Structured rubric (e.g. UTHSDC 2026)
        setSections(cats.sections);
        setPenalties(Array.isArray(cats.penalties) ? cats.penalties : []);
        setFlatCategories([]);
        setTotalMaxScore(Number(cats.total_max_score) || 25);
      } else if (Array.isArray(cats)) {
        // Flat rubric (e.g. Designapalooza)
        setFlatCategories(cats);
        setSections([]);
        setPenalties([]);
        const sum = cats.reduce((acc: number, c: any) => acc + (Number(c.max_score) || 0), 0);
        setTotalMaxScore(sum || 100);
      } else {
        setSections([]);
        setFlatCategories([]);
        setPenalties([]);
      }
    } catch (err) {
      console.error('Failed to fetch rubric:', err);
    }
  };

  const openScoring = (team: TeamSchedule) => {
    if (sections.length === 0 && flatCategories.length === 0) {
      fetchRubric();
    }
    setActiveTeam(team);
    setMessage('');

    const initialScores: Record<string, number> = {};
    const initialInputs: Record<string, string> = {};
    const existingScore = (team.Scores && team.Scores.length > 0) ? team.Scores[0] : null;

    let existingParsedScores = existingScore ? existingScore.scores : null;
    if (typeof existingParsedScores === 'string') {
      try {
        existingParsedScores = JSON.parse(existingParsedScores);
      } catch {
        existingParsedScores = null;
      }
    }

    const savedCriteria = (existingParsedScores && existingParsedScores.criteria && typeof existingParsedScores.criteria === 'object')
      ? existingParsedScores.criteria
      : (existingParsedScores || {});

    if (sections.length > 0) {
      // Structured (UTHSDC)
      sections.forEach(sec => {
        sec.criteria.forEach(crit => {
          const val = savedCriteria[crit.id] !== undefined
            ? Number(savedCriteria[crit.id])
            : (savedCriteria[crit.name] !== undefined ? Number(savedCriteria[crit.name]) : 0);
          initialScores[crit.id] = val;
          initialInputs[crit.id] = String(val);
        });
      });
    } else {
      // Flat (Designapalooza)
      flatCategories.forEach(cat => {
        const val = savedCriteria[cat.name] !== undefined ? Number(savedCriteria[cat.name]) : 0;
        initialScores[cat.name] = val;
        initialInputs[cat.name] = String(val);
      });
    }

    setCriteriaScores(initialScores);
    setInputStrings(initialInputs);

    // Penalties
    if (existingParsedScores && Array.isArray(existingParsedScores.penalties)) {
      setSelectedPenalties(existingParsedScores.penalties);
    } else if (existingParsedScores && Array.isArray(existingParsedScores.__penalties)) {
      setSelectedPenalties(existingParsedScores.__penalties);
    } else {
      setSelectedPenalties([]);
    }

    // Feedback
    const parsedFb = parseFeedback(existingScore ? existingScore.feedback : '');
    setFeedbackStrengths(parsedFb.strengths);
    setFeedbackImprovements(parsedFb.improvements);
    setFeedbackComments(parsedFb.comments);
  };

  const handlePillSelect = (id: string, point: number) => {
    setCriteriaScores(prev => ({ ...prev, [id]: point }));
    setInputStrings(prev => ({ ...prev, [id]: String(point) }));
  };

  const handleScoreInputChange = (id: string, maxScore: number, rawVal: string) => {
    setInputStrings(prev => ({ ...prev, [id]: rawVal }));
    if (rawVal.trim() === '') return;
    const num = parseFloat(rawVal);
    if (isNaN(num)) return;
    const rounded = Math.round(num);
    const clamped = Math.min(maxScore, Math.max(0, rounded));
    setCriteriaScores(prev => ({ ...prev, [id]: clamped }));
  };

  const handleScoreInputBlur = (id: string, maxScore: number) => {
    const current = criteriaScores[id] ?? 0;
    const clamped = Math.min(maxScore, Math.max(0, Math.round(current)));
    setCriteriaScores(prev => ({ ...prev, [id]: clamped }));
    setInputStrings(prev => ({ ...prev, [id]: String(clamped) }));
  };

  const togglePenalty = (penaltyId: string) => {
    setSelectedPenalties(prev =>
      prev.includes(penaltyId) ? prev.filter(id => id !== penaltyId) : [...prev, penaltyId]
    );
  };

  // Calculations
  const rawScore = Object.values(criteriaScores).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const penaltyDeduction = selectedPenalties.reduce((sum, pId) => {
    const p = penalties.find(pen => pen.id === pId);
    return sum + (p ? p.deduction : 0);
  }, 0);
  const finalScore = Math.max(0, rawScore - penaltyDeduction);

  const submitScore = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeTeam || !user?.id || !user?.competitionId) return;

    setSubmitting(true);
    setMessage('');
    try {
      const isStructured = sections.length > 0;
      const formattedFeedback = isStructured
        ? formatFeedback(feedbackStrengths, feedbackImprovements, feedbackComments)
        : feedbackComments || feedbackStrengths;

      const payloadScores = isStructured
        ? {
            criteria: criteriaScores,
            penalties: selectedPenalties,
            raw_score: rawScore,
            penalty_deduction: penaltyDeduction,
            final_score: finalScore
          }
        : criteriaScores;

      await request('/judge', {
        method: 'POST',
        body: JSON.stringify({
          competitionId: user.competitionId,
          judgeId: user.id,
          teamId: activeTeam.id,
          scores: payloadScores,
          feedback: formattedFeedback
        })
      });

      fetchSchedule();
      setActiveTeam(null);
      setMessage('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to save scores');
    } finally {
      setSubmitting(false);
    }
  };

  const judgeNumber = user?.judge_number || (user?.username?.match(/^judge_?(\d+)/i)?.[1]) || user?.id;

  return (
    <div className="judge-view-container">
      <div className="judge-hero-header">
        <div className="judge-hero-bg-pattern"></div>
        <div className="judge-hero-content">
          <header className="judge-header-flex">
            <h1 className="text-display-lg judge-portal-title">
              Welcome, {judgeNumber ? `Judge ${judgeNumber}` : 'Judge'}
            </h1>
          </header>
        </div>
      </div>

      <main className="judge-main-content">
        <section className="judge-schedule-section">
          <div className="judge-schedule-header">
            <div className="judge-schedule-title-row">
              <h2 className="text-headline-lg" style={{ margin: 0 }}>Your Schedule</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={rubricDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="judge-doc-btn"
                  title="Open Detailed Rubric Document in a new tab"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <span>Detailed Rubric Guide</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
                <div className="judge-room-badge">
                  <span className="text-label-bold">{roomName ? (roomName.startsWith('Room ') ? roomName : `Room: ${roomName}`) : 'Room: Unassigned'}</span>
                </div>
              </div>
            </div>
            <p className="judge-schedule-subtitle">
              Select a team below to submit and record your rubric evaluation.
            </p>
          </div>

          <div className="team-schedule-grid">
            {schedule.length === 0 ? (
              <div className="empty-schedule text-label-bold">No teams assigned to this room yet.</div>
            ) : (
              schedule.map(team => (
                <div 
                  key={team.id} 
                  className={`bento-card schedule-card ${team.isGraded ? 'graded' : ''}`}
                  onClick={() => openScoring(team)}
                >
                  <div className="schedule-card-top">
                    <span className="schedule-time-badge">{team.start_time} - {team.end_time}</span>
                  </div>
                  <div className="schedule-card-mid">
                    <h3 className="text-headline-md team-name-title">
                      Team {team.team_number}
                    </h3>
                    <div style={{ marginTop: '6px' }}>
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
              <div className="modal-header-info">
                <h2>Evaluating Team {activeTeam.team_number}</h2>
                <span className="modal-header-meta">
                  {roomName ? (roomName.startsWith('Room ') ? roomName : `Room ${roomName}`) : ''} • {activeTeam.start_time} - {activeTeam.end_time}
                </span>
              </div>
              <div className="modal-header-right">
                <div className="live-score-pill">
                  Total: <strong>{finalScore}</strong> / {totalMaxScore}
                </div>
                <button className="close-btn" onClick={() => setActiveTeam(null)}>×</button>
              </div>
            </div>

            <RubricCockpit
              sections={sections}
              flatCategories={flatCategories}
              penalties={penalties}
              totalMaxScore={totalMaxScore}
              criteriaScores={criteriaScores}
              inputStrings={inputStrings}
              selectedPenalties={selectedPenalties}
              feedbackStrengths={feedbackStrengths}
              feedbackImprovements={feedbackImprovements}
              feedbackComments={feedbackComments}
              onPillSelect={handlePillSelect}
              onInputChange={handleScoreInputChange}
              onInputBlur={handleScoreInputBlur}
              onTogglePenalty={togglePenalty}
              onFeedbackChange={(field, val) => {
                if (field === 'strengths') setFeedbackStrengths(val);
                else if (field === 'improvements') setFeedbackImprovements(val);
                else setFeedbackComments(val);
              }}
              onSubmit={submitScore}
              submitting={submitting}
              submitButtonText="SAVE EVALUATION"
              statusMessage={message}
              rubricDocUrl={rubricDocUrl}
              onClose={() => setActiveTeam(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
