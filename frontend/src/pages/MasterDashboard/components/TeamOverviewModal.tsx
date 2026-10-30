import React, { useState, useEffect } from 'react';
import './RoomCard.css';
import './TeamOverviewModal.css';
import { request } from '../../../shared/api/http';
import {
  RubricCockpit,
  type RubricSection,
  type FlatCategory,
  type JudgingPenalty
} from '../../../components/common/RubricCockpit';

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

interface JudgeEditState {
  criteria: Record<string, number>;
  inputs: Record<string, string>;
  penalties: string[];
  feedbackStrengths: string;
  feedbackImprovements: string;
  feedbackComments: string;
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

export const TeamOverviewModal: React.FC<TeamOverviewModalProps> = ({ team, competitionId, onClose, onUpdate }) => {
  const [teamScores, setTeamScores] = useState<any[]>([]);
  const [sections, setSections] = useState<RubricSection[]>([]);
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);
  const [penalties, setPenalties] = useState<JudgingPenalty[]>([]);
  const [totalMaxScore, setTotalMaxScore] = useState<number>(25);

  const [loadingScores, setLoadingScores] = useState(false);
  const [editStates, setEditStates] = useState<Record<string | number, JudgeEditState>>({});
  const [activeJudgeIdx, setActiveJudgeIdx] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | number | null>(null);
  const [statusMessages, setStatusMessages] = useState<Record<string | number, string>>({});
  const [rubricDocUrl, setRubricDocUrl] = useState<string>(
    'https://www.google.com/search?q=cool+dog&oq=cool+dog&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIKCAgQABiABBi0BzIHCAkQABiABNIBCDMxOThqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8'
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoadingScores(true);
      try {
        let loadedSections: RubricSection[] = [];
        let loadedFlat: FlatCategory[] = [];
        let loadedPenalties: JudgingPenalty[] = [];

        if (competitionId) {
          try {
            const compData = await request<any>(`/competitions/${competitionId}`);
            let cats = compData?.categories;
            if (typeof cats === 'string') {
              try { cats = JSON.parse(cats); } catch { cats = null; }
            }
            if (cats && typeof cats === 'object' && !Array.isArray(cats)) {
              if (cats.document_url || cats.rubric_url) {
                setRubricDocUrl(cats.document_url || cats.rubric_url);
              }
            }
            if (cats && typeof cats === 'object' && !Array.isArray(cats) && Array.isArray(cats.sections)) {
              loadedSections = cats.sections;
              loadedPenalties = Array.isArray(cats.penalties) ? cats.penalties : [];
              setSections(loadedSections);
              setPenalties(loadedPenalties);
              setFlatCategories([]);
              setTotalMaxScore(Number(cats.total_max_score) || 25);
            } else if (Array.isArray(cats)) {
              loadedFlat = cats;
              setFlatCategories(loadedFlat);
              setSections([]);
              setPenalties([]);
              const sum = cats.reduce((acc: number, c: any) => acc + (Number(c.max_score) || 0), 0);
              setTotalMaxScore(sum || 100);
            }
          } catch (e) {
            console.error('Error fetching competition categories:', e);
          }
        }

        const data = await request<any[]>(`/teams/${team.id}/scores?competitionId=${competitionId}`);
        const parsedData = (data || []).map((d: any) => {
          let parsed = d.scores;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch { parsed = {}; }
          }
          return { ...d, scores: parsed || {} };
        });
        setTeamScores(parsedData);

        const initialEdits: Record<string | number, JudgeEditState> = {};
        parsedData.forEach(d => {
          const rawScores = d.scores || {};
          const savedCriteria = (rawScores.criteria && typeof rawScores.criteria === 'object')
            ? rawScores.criteria
            : rawScores;

          const criteriaMap: Record<string, number> = {};
          const inputMap: Record<string, string> = {};

          if (loadedSections.length > 0) {
            loadedSections.forEach(sec => {
              sec.criteria.forEach(crit => {
                const val = savedCriteria[crit.id] !== undefined
                  ? Number(savedCriteria[crit.id])
                  : (savedCriteria[crit.name] !== undefined ? Number(savedCriteria[crit.name]) : 0);
                criteriaMap[crit.id] = val;
                inputMap[crit.id] = String(val);
              });
            });
          } else {
            loadedFlat.forEach(cat => {
              const val = savedCriteria[cat.name] !== undefined ? Number(savedCriteria[cat.name]) : 0;
              criteriaMap[cat.name] = val;
              inputMap[cat.name] = String(val);
            });
          }

          let penaltyList: string[] = [];
          if (Array.isArray(rawScores.penalties)) {
            penaltyList = rawScores.penalties;
          } else if (Array.isArray(rawScores.__penalties)) {
            penaltyList = rawScores.__penalties;
          }

          const fbParsed = parseFeedback(d.feedback);

          initialEdits[d.id] = {
            criteria: criteriaMap,
            inputs: inputMap,
            penalties: penaltyList,
            feedbackStrengths: fbParsed.strengths,
            feedbackImprovements: fbParsed.improvements,
            feedbackComments: fbParsed.comments
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

  const handlePillSelect = (scoreId: string | number, id: string, point: number) => {
    setEditStates(prev => {
      const current = prev[scoreId] || {
        criteria: {}, inputs: {}, penalties: [], feedbackStrengths: '', feedbackImprovements: '', feedbackComments: ''
      };
      return {
        ...prev,
        [scoreId]: {
          ...current,
          criteria: { ...current.criteria, [id]: point },
          inputs: { ...current.inputs, [id]: String(point) }
        }
      };
    });
  };

  const handleScoreInputChange = (scoreId: string | number, id: string, maxScore: number, rawVal: string) => {
    setEditStates(prev => {
      const current = prev[scoreId] || {
        criteria: {}, inputs: {}, penalties: [], feedbackStrengths: '', feedbackImprovements: '', feedbackComments: ''
      };
      const newInputs = { ...current.inputs, [id]: rawVal };
      let newCriteria = { ...current.criteria };

      if (rawVal.trim() !== '') {
        const num = Number(rawVal);
        if (!isNaN(num)) {
          const clamped = Math.min(maxScore, Math.max(0, Math.round(num)));
          newCriteria[id] = clamped;
        }
      }

      return {
        ...prev,
        [scoreId]: {
          ...current,
          inputs: newInputs,
          criteria: newCriteria
        }
      };
    });
  };

  const handleScoreInputBlur = (scoreId: string | number, id: string, maxScore: number) => {
    setEditStates(prev => {
      const current = prev[scoreId] || {
        criteria: {}, inputs: {}, penalties: [], feedbackStrengths: '', feedbackImprovements: '', feedbackComments: ''
      };
      const rawVal = current.inputs[id] || '0';
      const num = Number(rawVal);
      const clamped = isNaN(num) ? 0 : Math.min(maxScore, Math.max(0, Math.round(num)));

      return {
        ...prev,
        [scoreId]: {
          ...current,
          criteria: { ...current.criteria, [id]: clamped },
          inputs: { ...current.inputs, [id]: String(clamped) }
        }
      };
    });
  };

  const togglePenalty = (scoreId: string | number, penaltyId: string) => {
    setEditStates(prev => {
      const current = prev[scoreId] || {
        criteria: {}, inputs: {}, penalties: [], feedbackStrengths: '', feedbackImprovements: '', feedbackComments: ''
      };
      const prevPens = current.penalties || [];
      const newPens = prevPens.includes(penaltyId)
        ? prevPens.filter(p => p !== penaltyId)
        : [...prevPens, penaltyId];

      return {
        ...prev,
        [scoreId]: {
          ...current,
          penalties: newPens
        }
      };
    });
  };

  const handleFeedbackChange = (scoreId: string | number, field: 'strengths' | 'improvements' | 'comments', value: string) => {
    setEditStates(prev => {
      const current = prev[scoreId] || {
        criteria: {}, inputs: {}, penalties: [], feedbackStrengths: '', feedbackImprovements: '', feedbackComments: ''
      };
      return {
        ...prev,
        [scoreId]: {
          ...current,
          feedbackStrengths: field === 'strengths' ? value : current.feedbackStrengths,
          feedbackImprovements: field === 'improvements' ? value : current.feedbackImprovements,
          feedbackComments: field === 'comments' ? value : current.feedbackComments
        }
      };
    });
  };

  const handleSaveOverride = async (scoreRecord: any) => {
    if (!competitionId) return;
    const current = editStates[scoreRecord.id];
    if (!current) return;

    setSavingId(scoreRecord.id);
    setStatusMessages(prev => ({ ...prev, [scoreRecord.id]: '' }));

    const isStructured = sections.length > 0;
    const raw = Object.values(current.criteria).reduce((sum, v) => sum + (Number(v) || 0), 0);
    const penDeduction = (current.penalties || []).reduce((sum, pId) => {
      const p = penalties.find(pen => pen.id === pId);
      return sum + (p ? p.deduction : 0);
    }, 0);
    const final = Math.max(0, raw - penDeduction);

    const formattedFeedback = isStructured
      ? formatFeedback(current.feedbackStrengths, current.feedbackImprovements, current.feedbackComments)
      : current.feedbackComments || current.feedbackStrengths;

    const payloadScores = isStructured
      ? {
          criteria: current.criteria,
          penalties: current.penalties,
          raw_score: raw,
          penalty_deduction: penDeduction,
          final_score: final
        }
      : current.criteria;

    try {
      await request('/judge', {
        method: 'POST',
        body: JSON.stringify({
          competitionId,
          judgeId: scoreRecord.judgeId,
          teamId: team.id,
          scores: payloadScores,
          feedback: formattedFeedback
        })
      });

      setStatusMessages(prev => ({ ...prev, [scoreRecord.id]: 'Score successfully saved to database.' }));
      onUpdate();

      // If it was a pending record, mark it as graded locally too
      if (scoreRecord.isPending) {
        scoreRecord.isPending = false;
      }

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

  const activeScore = teamScores[activeJudgeIdx] || null;
  const currentEdit = activeScore ? (editStates[activeScore.id] || {
    criteria: {}, inputs: {}, penalties: [], feedbackStrengths: '', feedbackImprovements: '', feedbackComments: ''
  }) : {
    criteria: {}, inputs: {}, penalties: [], feedbackStrengths: '', feedbackImprovements: '', feedbackComments: ''
  };

  const rawActive = Object.values(currentEdit.criteria).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const penActive = (currentEdit.penalties || []).reduce((sum, pId) => {
    const p = penalties.find(pen => pen.id === pId);
    return sum + (p ? p.deduction : 0);
  }, 0);
  const finalActive = Math.max(0, rawActive - penActive);

  return (
    <div className="judge-modal-overlay" onClick={onClose}>
      <div className="judge-modal-content scoring-modal team-overview-modal-widescreen" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <h2>Evaluating Team {team.team_number}</h2>
            <span className="modal-header-meta">
              {team.start_time} - {team.end_time} • {activeScore?.Judge?.name || `Judge ${activeScore?.judgeId}`}
              {activeScore?.isPending ? ' (Not Yet Graded by Judge)' : ''}
            </span>

            {/* If multiple judges assigned to room, show compact tabs */}
            {teamScores.length > 1 && (
              <div className="admin-judge-tabs">
                {teamScores.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`admin-judge-tab ${activeJudgeIdx === idx ? 'active' : ''}`}
                    onClick={() => setActiveJudgeIdx(idx)}
                  >
                    {s.Judge?.name || `Judge ${s.judgeId}`}
                    {s.isPending ? ' (Pending)' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="modal-header-right">
            <div className="live-score-pill">
              Total: <strong>{finalActive}</strong> / {totalMaxScore}
            </div>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        {loadingScores ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', fontSize: '0.95rem', fontWeight: 600 }}>
            Loading team evaluation...
          </div>
        ) : activeScore ? (
          <RubricCockpit
            sections={sections}
            flatCategories={flatCategories}
            penalties={penalties}
            totalMaxScore={totalMaxScore}
            criteriaScores={currentEdit.criteria}
            inputStrings={currentEdit.inputs}
            selectedPenalties={currentEdit.penalties}
            feedbackStrengths={currentEdit.feedbackStrengths}
            feedbackImprovements={currentEdit.feedbackImprovements}
            feedbackComments={currentEdit.feedbackComments}
            onPillSelect={(id, pt) => handlePillSelect(activeScore.id, id, pt)}
            onInputChange={(id, max, val) => handleScoreInputChange(activeScore.id, id, max, val)}
            onInputBlur={(id, max) => handleScoreInputBlur(activeScore.id, id, max)}
            onTogglePenalty={(pId) => togglePenalty(activeScore.id, pId)}
            onFeedbackChange={(field, val) => handleFeedbackChange(activeScore.id, field, val)}
            onSubmit={() => handleSaveOverride(activeScore)}
            submitting={savingId === activeScore.id}
            submitButtonText={activeScore.isPending ? "SAVE EVALUATION" : "SAVE OVERRIDE"}
            statusMessage={statusMessages[activeScore.id]}
            rubricDocUrl={rubricDocUrl}
          />
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', fontSize: '0.95rem' }}>
            No judges assigned to this team.
          </div>
        )}
      </div>
    </div>
  );
};
