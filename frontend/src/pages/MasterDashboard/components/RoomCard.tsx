import React, { useState } from 'react';
import './RoomCard.css';
import { TeamOverviewModal } from './TeamOverviewModal';

interface Team {
  id: number;
  team_number: number;
  start_time: string;
  end_time: string;
  presentation_link: string | null;
  isGraded: boolean;
}

interface Judge {
  id?: number;
  name: string;
  username?: string;
}

interface RoomData {
  id: number;
  room: string;
  judges: Judge[];
  teams: Team[];
}

interface RoomCardProps {
  room: RoomData;
  allRooms?: RoomData[];
  onUpdate?: () => void;
  competitionId?: number;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, allRooms, onUpdate, competitionId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJudgeName, setNewJudgeName] = useState('');
  const [newJudgeUsername, setNewJudgeUsername] = useState('');
  const [newJudgePassword, setNewJudgePassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Team Details Modal State
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleCreateJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/judges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newJudgeName,
          username: newJudgeUsername,
          password: newJudgePassword,
          roomId: room.id,
          competitionId
        })
      });

      if (res.ok) {
        setNewJudgeName('');
        setNewJudgeUsername('');
        setNewJudgePassword('');
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create judge");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveJudge = async (judgeId: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this judge?")) return;
    try {
      const res = await fetch(`${API_URL}/judges/${judgeId}`, { method: 'DELETE' });
      if (res.ok) {
        if (onUpdate) onUpdate();
      } else {
        alert("Failed to delete judge.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveJudge = async (judgeId: number, newRoomId: number) => {
    if (newRoomId === room.id) return; // No change
    try {
      const res = await fetch(`${API_URL}/judges/${judgeId}/room`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: newRoomId })
      });
      if (res.ok) {
        if (onUpdate) onUpdate();
      } else {
        alert("Failed to move judge.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card room-card">
      <div className="room-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 className="text-headline-md room-card-title">Room {room.room}</h4>
          <p className="text-label-sm room-judges">
            Judges: {room.judges && room.judges.length > 0 && room.judges[0].name !== "NO JUDGE" 
              ? room.judges.map(j => j.name).join(', ') 
              : 'None assigned'}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ background: 'transparent', border: '1px solid var(--color-outline)', color: 'var(--color-on-surface)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
        >
          Manage Judges
        </button>
      </div>
      
      <div className="room-teams-list">
        {room.teams && room.teams.length > 0 ? (
          room.teams.map(team => (
            <div 
              key={team.id} 
              className="room-team-item" 
              onClick={() => setSelectedTeam(team)}
              style={{ cursor: 'pointer' }}
            >
              <div className="room-team-info">
                <span className="text-label-bold">Team {team.team_number}</span>
                <span className="text-label-sm team-time">{team.start_time} - {team.end_time}</span>
              </div>
              <div className="room-team-status">
                {team.presentation_link ? (
                  <span className="status-badge submitted">File Submitted</span>
                ) : (
                  <span className="status-badge missing">No File</span>
                )}
                
                {team.isGraded ? (
                  <span className="status-badge graded">Graded</span>
                ) : (
                  <span className="status-badge not-graded">Not Graded</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="room-empty-state">
            <span className="text-label-sm">No teams scheduled.</span>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="judge-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="judge-modal-content" onClick={e => e.stopPropagation()}>
            <div className="judge-modal-header">
              <h3>Manage Judges - Room {room.room}</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
            </div>
            
            <div className="judge-list-section">
              <h4>Current Judges</h4>
              {room.judges && room.judges.length > 0 && room.judges[0].name !== "NO JUDGE" ? (
                <ul className="judge-list">
                  {room.judges.map(judge => (
                    <li key={judge.id} className="judge-list-item">
                      <div className="judge-info">
                        <strong>{judge.name}</strong> 
                        <span className="text-label-sm">({judge.username})</span>
                      </div>
                      <div className="judge-actions">
                        <select 
                          className="room-select"
                          value={room.id}
                          onChange={(e) => handleMoveJudge(judge.id!, parseInt(e.target.value))}
                        >
                          {allRooms?.map(r => (
                            <option key={r.id} value={r.id}>Room {r.room}</option>
                          ))}
                        </select>
                        <button className="remove-btn" onClick={() => handleRemoveJudge(judge.id!)}>Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>No judges assigned to this room.</p>
              )}
            </div>

            <div className="add-judge-section">
              <h4>Create & Assign New Judge</h4>
              {error && <p className="error-text" style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
              <form onSubmit={handleCreateJudge} className="add-judge-form">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={newJudgeName}
                  onChange={e => setNewJudgeName(e.target.value)}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Username (e.g. firstname_event_year)" 
                  value={newJudgeUsername}
                  onChange={e => setNewJudgeUsername(e.target.value)}
                  required
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={newJudgePassword}
                  onChange={e => setNewJudgePassword(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Adding...' : 'Add Judge'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedTeam && (
        <TeamOverviewModal
          team={selectedTeam}
          competitionId={competitionId}
          onClose={() => setSelectedTeam(null)}
          onUpdate={onUpdate || (() => {})}
        />
      )}
    </div>
  );
};
