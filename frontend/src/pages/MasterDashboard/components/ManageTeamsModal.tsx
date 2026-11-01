import React, { useState, useEffect } from 'react';
import { request } from '../../../shared/api/http';
import './ManageTeamsModal.css';

interface TeamItem {
  id: number;
  team_number: number | string;
  start_time: string;
  end_time: string;
  presentation_link?: string | null;
  isGraded?: boolean;
  isFullyGraded?: boolean;
  gradedCount?: number;
  totalJudges?: number;
}

interface RoomData {
  id: number;
  room: string | number;
  judges?: any[];
  teams?: TeamItem[];
}

interface ManageTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomData;
  allRooms: RoomData[];
  competitionId?: number;
  onUpdate: () => void;
}

export const ManageTeamsModal: React.FC<ManageTeamsModalProps> = ({
  isOpen,
  onClose,
  room,
  allRooms,
  competitionId,
  onUpdate
}) => {
  const [newTeamNumber, setNewTeamNumber] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formattedRoomName = room.room?.toString().startsWith('Room ')
    ? room.room
    : `Room ${room.room}`;

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitionId) {
      setError("Competition ID is missing.");
      return;
    }
    if (!newTeamNumber.trim()) {
      setError("Please enter a valid team number.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await request('/teams', {
        method: 'POST',
        body: JSON.stringify({
          team_number: newTeamNumber.trim(),
          roomId: room.id,
          competitionId,
          start_time: newStartTime.trim() || '10:00 AM',
          end_time: newEndTime.trim() || '10:15 AM'
        })
      });

      setNewTeamNumber('');
      setNewStartTime('');
      setNewEndTime('');
      setSuccessMsg(`Team ${newTeamNumber.trim()} added successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      onUpdate();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveTeam = async (team: TeamItem, targetRoomId: number) => {
    if (targetRoomId === room.id) return;

    const targetRoom = allRooms.find(r => r.id === targetRoomId);
    const targetName = targetRoom ? (targetRoom.room?.toString().startsWith('Room ') ? targetRoom.room : `Room ${targetRoom.room}`) : `Room ${targetRoomId}`;

    if (team.isGraded) {
      const confirmMove = window.confirm(
        `Warning: Team ${team.team_number} has already been graded in this room.\n\nMoving them to ${targetName} will remove the previous judge's evaluation and scores, so that only the judge(s) in ${targetName} will grade this team fresh.\n\nAre you sure you want to proceed?`
      );
      if (!confirmMove) return;
    }

    try {
      await request(`/teams/${team.id}/room`, {
        method: 'PUT',
        body: JSON.stringify({ roomId: targetRoomId })
      });
      onUpdate();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to move team.');
    }
  };

  const handleStartEditTime = (team: TeamItem) => {
    setEditingTeamId(team.id);
    setEditStartTime(team.start_time || '');
    setEditEndTime(team.end_time || '');
  };

  const handleSaveTime = async (teamId: number) => {
    if (!editStartTime.trim() || !editEndTime.trim()) {
      alert("Start time and end time cannot be blank.");
      return;
    }

    try {
      await request(`/teams/${teamId}/time`, {
        method: 'PUT',
        body: JSON.stringify({
          start_time: editStartTime.trim(),
          end_time: editEndTime.trim()
        })
      });
      setEditingTeamId(null);
      onUpdate();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update time.');
    }
  };

  const handleDeleteTeam = async (team: TeamItem) => {
    const warningMsg = team.isGraded
      ? `WARNING: Team ${team.team_number} has already been graded!\n\nDeleting this team will PERMANENTLY remove their scores and feedback from the leaderboard.\n\nAre you sure you want to proceed?`
      : `Are you sure you want to remove Team ${team.team_number} from ${formattedRoomName}?`;

    if (!window.confirm(warningMsg)) return;

    try {
      await request(`/teams/${team.id}`, {
        method: 'DELETE'
      });
      onUpdate();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete team.');
    }
  };

  const currentTeams = room.teams || [];

  return (
    <div className="judge-modal-overlay" onClick={onClose}>
      <div className="judge-modal-content manage-teams-modal-content" onClick={e => e.stopPropagation()}>
        <div className="judge-modal-header">
          <div>
            <h3>Manage Teams - {formattedRoomName}</h3>
            <span className="manage-teams-subhead">{currentTeams.length} {currentTeams.length === 1 ? 'team' : 'teams'} currently assigned</span>
          </div>
          <button onClick={onClose} className="close-btn" title="Close (Esc)">&times;</button>
        </div>

        {error && <div className="manage-teams-alert error">{error}</div>}
        {successMsg && <div className="manage-teams-alert success">{successMsg}</div>}

        {/* Existing Teams List */}
        <div className="manage-teams-section">
          <h4>Current Schedule</h4>
          {currentTeams.length > 0 ? (
            <div className="manage-teams-list">
              {currentTeams.map(t => {
                const isEditingThis = editingTeamId === t.id;
                return (
                  <div key={t.id} className="manage-team-row">
                    <div className="manage-team-info">
                      <div className="manage-team-number-row">
                        <strong className="team-num-title">Team {t.team_number}</strong>
                        {t.isGraded ? (
                          <span className="status-badge graded">
                            {t.totalJudges && t.totalJudges > 1
                              ? `Graded (${t.gradedCount || 1}/${t.totalJudges})`
                              : 'Graded'}
                          </span>
                        ) : (
                          <span className="status-badge not-graded">Not Graded</span>
                        )}
                      </div>

                      {isEditingThis ? (
                        <div className="time-inline-edit-form">
                          <input
                            type="text"
                            placeholder="Start (10:00 AM)"
                            value={editStartTime}
                            onChange={e => setEditStartTime(e.target.value)}
                            className="time-edit-input"
                          />
                          <span>–</span>
                          <input
                            type="text"
                            placeholder="End (10:15 AM)"
                            value={editEndTime}
                            onChange={e => setEditEndTime(e.target.value)}
                            className="time-edit-input"
                          />
                          <button
                            type="button"
                            className="time-save-btn"
                            onClick={() => handleSaveTime(t.id)}
                            title="Save time"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            className="time-cancel-btn"
                            onClick={() => setEditingTeamId(null)}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="time-display-row">
                          <span className="team-time-slot">
                            {t.start_time || 'TBD'} – {t.end_time || 'TBD'}
                          </span>
                          <button
                            type="button"
                            className="time-edit-toggle-btn"
                            onClick={() => handleStartEditTime(t)}
                            title="Edit presentation time"
                          >
                            Edit Time
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="manage-team-actions">
                      <select
                        className="room-select"
                        value={room.id}
                        onChange={(e) => handleMoveTeam(t, parseInt(e.target.value))}
                        title="Move to another room"
                      >
                        <option value={room.id} disabled>Move Room...</option>
                        {allRooms?.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.id === room.id ? `Stay in Room ${r.room}` : `Move to Room ${r.room}`}
                          </option>
                        ))}
                      </select>
                      <button
                        className="remove-btn"
                        onClick={() => handleDeleteTeam(t)}
                        title="Remove team"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-teams-text">No teams currently assigned to this room.</p>
          )}
        </div>

        {/* Add Team on the Spot Section */}
        <div className="add-team-section">
          <h4>+ Add Team to this Room</h4>
          <form onSubmit={handleCreateTeam} className="add-team-form">
            <div className="add-team-grid">
              <div className="form-group">
                <label>Team Number</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={newTeamNumber}
                  onChange={e => setNewTeamNumber(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="text"
                  placeholder="e.g. 11:30 AM"
                  value={newStartTime}
                  onChange={e => setNewStartTime(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="text"
                  placeholder="e.g. 11:45 AM"
                  value={newEndTime}
                  onChange={e => setNewEndTime(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="submit-btn add-team-btn">
              {loading ? 'Adding Team...' : `Add Team to ${formattedRoomName}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
